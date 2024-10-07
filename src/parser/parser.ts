import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError, NodeType, Token } from '../../typescript/GS.types';
import {
	CodeBlockNode,
	EXPRESSION,
	GSType,
	Program,
	STATEMENT,
} from '../ast/ast';
import { BinaryExpr } from '../ast/expressions/binop.ast';
import { CallExpr } from '../ast/expressions/expressions.ast';
import {
	Identifier,
	NumberLiteral,
	StringLiteral,
} from '../ast/literals/literals.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../ast/statements/declarations.ast';
import { ReturnStatement } from '../ast/statements/statements.ast';
import { tokenize } from '../lexer/tokenizer';
import { getErrorLocation, getNodeTypeStringName } from '../util/parser.util';
import { Node } from './nodes';

export default class Parser {
	private tokens: Token[] = [];

	/**
	 *
	 * @returns Whether the token is an End of File token
	 */
	private isEOF(): boolean {
		return this.tokens[0].type == Node.Special.__EOF__;
	}

	/**
	 *
	 * @returns The current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 *
	 * @returns The next token
	 */
	private next(): Token {
		return this.tokens[1] as Token;
	}

	/**
	 *
	 * @returns The current and shifts token array
	 */
	private advance(): Token {
		return this.tokens.shift() as Token;
	}

	public expect(type: Token['type'], group: NodeType, errNote = ' '): Token {
		const token = this.tokens.shift() as Token;
		if (!token || token.type != type) {
			throw new GSError(
				SpecialError.ParseError,
				`Expected "${getNodeTypeStringName(
					type,
					group
				)}" ${errNote}, instead saw token "${getNodeTypeStringName(
					token.type,
					token.nodeGroup
				)}"`,
				`${SOURCE_FILE}:${getErrorLocation(token)}`
			);
		}

		return token;
	}

	public get Tokens(): Token[] {
		return this.tokens;
	}

	public tokenizeSourceFile(src: string): void {
		this.tokens = tokenize(src);
	}

	public generateAST(): Program {
		const program: Program = {
			kind: 'Program',
			body: [],
			start: {
				Line: 1,
				Column: 1,
			},
			end: {
				Line: 1,
				Column: 1,
			},
		};

		while (!this.isEOF()) {
			program.body.push(this.parseStatement());
		}

		const EOFToken = this.current();
		if (EOFToken.type != Node.Special.__EOF__)
			throw new GSError(
				SpecialError.ParseError,
				'<EOF> (End of File) token not found. File may be corrupt.',
				`${SOURCE_FILE}:${getErrorLocation(this.current())}`
			);

		program.end = {
			Line: EOFToken.__GSC._POS.end.Line!,
			Column: EOFToken.__GSC._POS.end.Column!,
		};

		return program;
	}

	// [STATEMENTS]
	private parseStatement(): STATEMENT {
		switch (this.current().type) {
			case Node.Keyword.Var:
			case Node.Keyword.Const:
				return this.parseVariableDeclaration();

			case Node.Keyword.Function:
				return this.parseFunctionDeclaration();
			case Node.Keyword.Return:
				return this.parseReturnStatement();

			default:
				return this.parseExpr();
		}
	}

	private parseCodeBlock(): CodeBlockNode {
		const startPos = this.expect(
			Node.Group.OpenBrace,
			'Group',
			'at start of code block'
		).__GSC._POS.start;

		const body: CodeBlockNode = {
			kind: 'CodeBlockNode',
			body: [],
			start: {
				Line: startPos.Line!,
				Column: startPos.Column!,
			},
			end: {
				Line: startPos.Line!,
				Column: startPos.Column!,
			},
		};

		while (!this.isEOF() && this.current().type !== Node.Group.CloseBrace) {
			body.body.push(this.parseStatement());
		}

		const endPos = this.expect(
			Node.Group.CloseBrace,
			'Group',
			'at end of code block'
		).__GSC._POS.end;

		body.end = {
			Line: endPos.Line!,
			Column: endPos.Column!,
		};

		return body;
	}

	// DECLARATIONS
	private parseVariableDeclaration(): STATEMENT {
		const tokenPos = this.current().__GSC._POS;
		const keyword = this.advance();
		const isConst =
			keyword.type == Node.Keyword.Const &&
			keyword.nodeGroup == 'Keyword';
		const identifier = this.expect(
			Node.Literal.IDENTIFIER,
			'Literal',
			`following ${isConst ? 'const' : 'var'} keyword`
		).value;
		let type: GSType = 'any';

		if (
			this.current().type == Node.Symbol.Colon &&
			this.current().nodeGroup == 'Symbol'
		) {
			this.advance();
			type = this.expect(
				Node.Special.__TYPE,
				'Special',
				'following ":" in variable declaration'
			).value as GSType;
		}

		if (
			this.current().type == Node.Symbol.Semicolon &&
			this.current().nodeGroup == 'Symbol'
		) {
			const semicolonPos = this.advance().__GSC._POS;
			if (isConst) {
				throw new GSError(
					SpecialError.ParseError,
					'Constant variables must be declared with a value',
					`${SOURCE_FILE}:${getErrorLocation(this.current())}`
				);
			}

			return {
				kind: 'VariableDeclaration',
				constant: false,
				identifier,
				valueType: type,
				start: tokenPos.start,
				end: semicolonPos.end,
			} as VariableDeclaration;
		}

		this.expect(
			Node.AssignmentOperator.Equals,
			'AssignmentOperator',
			'following variable identifier'
		);

		const declaration = {
			kind: 'VariableDeclaration',
			value: this.parseExpr(),
			identifier,
			constant: isConst,
			valueType: type,
			start: tokenPos.start,
			end: this.next().__GSC._POS.end,
		} as VariableDeclaration;

		this.expect(
			Node.Symbol.Semicolon,
			'Symbol',
			'following variable declaration'
		);

		return declaration;
	}

	private parseFunctionDeclaration(): STATEMENT {
		const tokenPos = this.advance().__GSC._POS;

		const name = this.expect(
			Node.Literal.IDENTIFIER,
			'Literal',
			'following "function" keyword'
		).value;

		// get function parameters and parse types if included
		const params: FunctionDeclaration['parameters'] = {};
		this.expect(Node.Group.OpenParen, 'Group', 'before parameter list');
		while (this.current().type !== Node.Group.CloseParen) {
			const paramIdentifier = this.expect(
				Node.Literal.IDENTIFIER,
				'Literal',
				'following parameter list'
			).value;
			let paramType: GSType = 'any';
			if (this.current().type === Node.Symbol.Colon) {
				this.advance();
				paramType = this.expect(Node.Special.__TYPE, 'Special')
					.value as GSType;
			}

			params[paramIdentifier] = paramType;

			if (this.current().type === Node.Symbol.Comma) {
				this.advance();
			} else if (this.current().type === Node.Group.CloseParen) {
				break;
			}
		}

		this.expect(Node.Group.CloseParen, 'Group', 'following parameter list');

		let returnType: GSType = 'any';

		// parse function return type if included
		if (this.current().type === Node.Symbol.Colon) {
			this.advance();
			returnType = this.expect(Node.Special.__TYPE, 'Special')
				.value as GSType;
		}

		const body = this.parseCodeBlock();

		const func = {
			kind: 'FunctionDeclaration',
			name,
			body,
			parameters: params,
			returnType,
			start: tokenPos.start,
			end: body.end,
		} as FunctionDeclaration;

		return func;
	}

	private parseReturnStatement(): STATEMENT {
		const tokenPos = this.advance().__GSC._POS;
		const returnValue = this.parseExpr();

		const endPos = this.expect(
			Node.Symbol.Semicolon,
			'Symbol',
			'following return statement'
		).__GSC._POS;

		return {
			kind: 'ReturnStatement',
			value: returnValue,
			start: tokenPos.start,
			end: endPos.end,
		} as ReturnStatement;
	}

	// [EXPRESSIONS]
	private parseExpr(): EXPRESSION {
		return this.parseMultiplicativeExpr();
	}

	private parseMultiplicativeExpr(): EXPRESSION {
		let lhs = this.parseAdditiveExpr();

		while (
			[Node.Symbol.Multiply, Node.Symbol.Divide].includes(
				//@ts-expect-error
				this.current().type
			)
		) {
			const op = this.advance().type;
			const rhs = this.parseMultiplicativeExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
				start: lhs.start,
				end: rhs.end,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseAdditiveExpr(): EXPRESSION {
		let lhs = this.parseCallMemberExpr();

		while (
			//@ts-expect-error
			[Node.Symbol.Plus, Node.Symbol.Minus].includes(this.current().type)
		) {
			const op = this.advance().type;
			const rhs = this.parseAdditiveExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
				start: lhs.start,
				end: rhs.end,
			} as BinaryExpr;
		}

		return lhs;
	}

	// MEMBER/CALL EXPRESSIONS
	private parseCallMemberExpr(): EXPRESSION {
		const member = this.parsePrimaryExpression();

		if (this.current().type == Node.Group.OpenParen) {
			return this.parseCallExpr(member);
		}

		return member;
	}

	private parseCallExpr(caller: EXPRESSION): EXPRESSION {
		const args = this.parseArgs();
		let callExpr: EXPRESSION = {
			kind: 'CallExpr',
			caller,
			args,
			start: caller.start,
			end: args[args.length - 1]?.end || caller.end,
		} as CallExpr;

		if (this.current().type == Node.Group.OpenParen)
			callExpr = this.parseCallExpr(callExpr);

		return callExpr;
	}

	// helper function
	private parseArgs(): EXPRESSION[] {
		this.expect(Node.Group.OpenParen, 'Group', 'before argument list');

		const args =
			this.current().type == Node.Group.CloseParen
				? []
				: this.parseArgumentList();

		this.expect(Node.Group.CloseParen, 'Group', 'following argument list');

		return args;
	}

	private parseArgumentList(): EXPRESSION[] {
		const args = [this.parseExpr()];

		while (this.current().type == Node.Symbol.Comma && this.advance()) {
			args.push(this.parseExpr());
		}

		return args;
	}

	// Fall back to primary expression parsing
	private parsePrimaryExpression(): EXPRESSION {
		const token = this.current();

		switch (token.type) {
			case Node.Literal.IDENTIFIER:
				return {
					kind: 'Identifier',
					symbol: this.advance().value,
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as Identifier;

			case Node.Literal.NUMBER:
				return {
					kind: 'NumberLiteral',
					value: parseFloat(this.advance().value),
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as NumberLiteral;

			case Node.Literal.STRING:
				return {
					kind: 'StringLiteral',
					value: this.advance().value,
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as StringLiteral;

			case Node.Group.OpenParen:
				this.advance();
				const value = this.parseExpr();
				this.expect(Node.Group.CloseParen, 'Group');

				return value;

			default:
				throw new GSError(
					SpecialError.ParseError,
					`Unexpected token "${getNodeTypeStringName(
						token.type,
						token.nodeGroup
					)}"`,
					`${SOURCE_FILE}:${getErrorLocation(token)}`
				);
		}
	}
}
