import { sourceFile } from '../..';
import { AssignmentExpr } from '../ast/assignments.ast';
import {
	CodeBlockNode,
	EXPRESSION,
	EndOfFileNode,
	Program,
	STATEMENT,
} from '../ast/ast';
import { BinaryExpr } from '../ast/binop.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../ast/declarations.ast';
import { CallExpr } from '../ast/expressions.ast';
import { Identifier, NumberLiteral, StringLiteral } from '../ast/literals.ast';
import { ReturnStatement } from '../ast/statements.ast';
import { tokenize } from '../lexer/tokenizer';
import { NodeType } from '../nodes';
import { Token, getTokenByTypeEnum } from '../tokens';
import { getErrorLocation } from '../util/getErrLoc';
import { ParseError } from '../util/parseError';

export default class Parser {
	private tokens: Array<Token> = [];

	/**
	 * Check for End of File token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type != NodeType.__EOF__;
	}

	/**
	 * @returns the current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 * @returns the current token and shifts the token array
	 */
	private advance(): Token {
		return this.tokens.shift() as Token;
	}

	/**
	 *
	 * @returns the next token
	 */
	private next(): Token {
		return this.tokens[1] as Token;
	}

	/**
	 * Checks if the current token matches the expected type, and throws an error if it doesn't
	 *
	 * @param errNote Output: Expected "(expectedTokenType)" (errNote), instead saw "(encounteredTokenType)"
	 *
	 * @returns the current token if it matches the expected token
	 */
	private expect(type: NodeType, errNote = ''): Token {
		if (errNote.length > 0) errNote = ' ' + errNote;
		const token = this.tokens.shift() as Token;
		if (!token || token.type != type) {
			console.log(
				new ParseError(
					`Expected "${
						getTokenByTypeEnum(type)?.value
					}"${errNote}, instead saw "${token.value}"`,
					`${sourceFile}:${getErrorLocation(token)}`
				)
			);
			process.exit(1);
		}

		return token;
	}

	public get Tokens(): Array<Token> {
		return this.tokens;
	}

	public tokenizeSource(src: string): void {
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

		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		const EOFToken = this.current();

		if (EOFToken.type != NodeType.__EOF__) {
			console.log(
				new ParseError(
					'Uncaught: Missing EndOfFile <EOF> token',
					`${sourceFile}:${this.current().__GSC._POS.start.Line}:${
						this.current().__GSC._POS.start.Column
					}`
				)
			);
			process.exit(1);
		}

		program.end = {
			Line: EOFToken.__GSC._POS.end.Line!,
			Column: EOFToken.__GSC._POS.end.Column!,
		};

		return program;
	}

	// [STATEMENTS]
	private parseStatement(): STATEMENT {
		switch (this.current().type) {
			case NodeType.Let:
			case NodeType.Const:
				return this.parseVariableDeclaration();

			case NodeType.Func:
				return this.parseFunctionDeclaration();
			case NodeType.Return:
				return this.parseReturnStatement();

			default:
				return this.parseExpr();
		}
	}

	private parseCodeBlock(): CodeBlockNode {
		const openBracePos = this.expect(
			NodeType.OpenBrace,
			'at start of code block'
		).__GSC._POS;

		const body: CodeBlockNode = {
			kind: 'CodeBlockNode',
			body: [],
			start: {
				Line: openBracePos.start.Line!,
				Column: openBracePos.start.Column!,
			},
			end: {
				Line: openBracePos.end.Line!,
				Column: openBracePos.end.Column!,
			},
		};

		while (this.notEOF() && this.current().type !== NodeType.CloseBrace) {
			const stmt = this.parseStatement();
			body.body.push(stmt);
		}

		const closeBracePos = this.expect(
			NodeType.CloseBrace,
			'at end of code block'
		).__GSC._POS;

		body.end = {
			Line: closeBracePos.end.Line!,
			Column: closeBracePos.end.Column!,
		};

		return body;
	}

	// [STATEMENTS.DECLARATIONS]

	private parseVariableDeclaration(): STATEMENT {
		const varDecTokenPos = this.current().__GSC._POS;
		const isConstant = this.advance().type == NodeType.Const;
		const identifier = this.expect(
			NodeType.Identifier,
			`following ${isConstant ? 'const' : 'let'} keyword`
		).value;

		if (this.current().type == NodeType.Semicolon) {
			const semicolonPosData = this.advance().__GSC._POS;
			if (isConstant) {
				console.log(
					new ParseError(
						'Constant variables must be delcared with a value',
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
				process.exit(1);
			}

			return {
				kind: 'VariableDeclaration',
				constant: false,
				identifier,
				start: varDecTokenPos.start,
				end: semicolonPosData.end,
			} as VariableDeclaration;
		}

		this.expect(NodeType.Equals, 'following variable identifier');

		const declaration = {
			kind: 'VariableDeclaration',
			value: this.parseExpr(),
			identifier,
			constant: isConstant,
			start: varDecTokenPos.start,
			end: this.next().__GSC._POS.end,
		} as VariableDeclaration;

		this.expect(NodeType.Semicolon, 'following variable declaration');

		return declaration;
	}

	private parseFunctionDeclaration(): STATEMENT {
		const funcTokenPos = this.advance().__GSC._POS;

		const name = this.expect(
			NodeType.Identifier,
			'following "func" keyword'
		).value;

		const args = this.parseArgs();
		const params: Array<string> = [];

		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				console.log(
					new ParseError(
						'Expected arguments to be identifiers',
						`${sourceFile}:${
							this.current().__GSC._POS.start.Line
						}:${this.current().__GSC._POS.start.Column}`
					)
				);
				process.exit(1);
			}

			params.push((arg as Identifier).symbol);
		}

		const body = this.parseCodeBlock();

		const func = {
			kind: 'FunctionDeclaration',
			name,
			body,
			parameters: params,
			start: funcTokenPos.start,
			end: body.end,
		} as FunctionDeclaration;

		return func;
	}

	private parseReturnStatement(): STATEMENT {
		const returnTokenPos = this.advance().__GSC._POS;

		const value = this.parseExpr();

		const semicolonTokenPos = this.expect(
			NodeType.Semicolon,
			'following return statement'
		).__GSC._POS;

		return {
			kind: 'ReturnStatement',
			value,
			start: returnTokenPos.start,
			end: semicolonTokenPos.end,
		} as ReturnStatement;
	}

	// [FUNCTIONS.ARGUMENTS/PARAMETERS]
	private parseArgs(): Array<EXPRESSION> {
		this.expect(NodeType.OpenParen, 'before parameter list');

		const args =
			this.current().type == NodeType.CloseParen
				? []
				: this.parseArgumentsList();

		this.expect(NodeType.CloseParen, 'after parameters list');

		return args;
	}

	private parseArgumentsList(): Array<EXPRESSION> {
		const args = [this.parseExpr()];

		while (this.current().type == NodeType.Comma && this.advance()) {
			args.push(this.parseExpr());
		}

		return args;
	}

	// [EXPRESSIONS]
	private parseExpr(): EXPRESSION {
		return this.parseAsgExpr();
	}

	//
	// Expressions parsed in Order of Precedence (_OPC)
	//
	// See lexer/types.ts for more info
	//

	private parseAsgExpr(): EXPRESSION {
		const lhs = this.parseMultiplicativeExpr();

		if (this.current().type == NodeType.Equals) {
			this.advance();
			const rhs = this.parseAsgExpr();
			return {
				kind: 'AssignmentExpr',
				value: rhs,
				assigne: lhs,
				AsgOp: '=',
				start: lhs.start,
				end: rhs.end,
			} as AssignmentExpr;
		}

		return lhs;
	}

	private parseMultiplicativeExpr(): EXPRESSION {
		let lhs = this.parseAdditiveExpr();

		while (['*', '/', '%'].includes(this.current().value)) {
			const op = this.advance().value;
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
		let lhs = this.parsePrimaryExpression();

		while (['+', '-'].includes(this.current().value)) {
			const op = this.advance().value;
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

	// [OTHER]

	//
	// Any other operation that has the "_OPC.None" property
	//

	private parseCallMemberExpr(): EXPRESSION {
		const member = this.parseCallMemberExpr();

		if (this.current().type == NodeType.OpenParen) {
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
			end: args[args.length - 1].end,
		} as CallExpr;

		if (this.current().type == NodeType.OpenParen)
			callExpr = this.parseCallExpr(callExpr);

		return callExpr;
	}

	private parseMemberExpr(): EXPRESSION {
		let object = this.parsePrimaryExpression();

		while (
			this.current().type == NodeType.Dot ||
			this.current().type == NodeType.OpenBracket
		) {
			const op = this.advance();
			let property: EXPRESSION;
			let computed: boolean;

			if (op.type == NodeType.Dot) {
				computed = false;
				property = this.parsePrimaryExpression();

				if (property.kind != 'Identifier') {
					// con;
				}
			}
		}
	}

	// Handles everything else
	private parsePrimaryExpression(): EXPRESSION {
		const token = this.current();

		switch (token.type) {
			case NodeType.Identifier:
				return {
					kind: 'Identifier',
					symbol: this.advance().value,
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.end.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.start.Column,
					},
				} as Identifier;

			case NodeType.Number:
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

			case NodeType.String:
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

			case NodeType.OpenParen:
				this.advance();
				const value = this.parseExpr();
				this.expect(NodeType.CloseParen);

				return value;

			default:
				console.log(
					new ParseError(
						`Uncaught: Unexpected token "${
							getTokenByTypeEnum(this.current().type)?.value
						}"`,
						`${sourceFile || 'GSREPL'}:${
							this.current().__GSC._POS.start.Line
						}:${this.current().__GSC._POS.start.Column}`
					)
				);
				process.exit(1);
		}
	}
}
