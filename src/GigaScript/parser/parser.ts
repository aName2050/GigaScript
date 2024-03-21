import { Program, STATEMENT, EXPRESSION } from '../ast/ast';
import { AssignmentExpr, UnaryExpr } from '../ast/assignments.ast';
import { BinaryExpr } from '../ast/binop.ast';
import { VarDeclaration, FuncDeclaration } from '../ast/declarations.ast';
import {
	Identifier,
	Literal,
	ArrayLiteral,
	NumberLiteral,
	ObjectLiteral,
	StringLiteral,
	Property,
} from '../ast/literals.ast';
import { BitwiseExpr } from '../ast/bitwise.ast';
import { tokenize } from '../lexer/tokenizer';
import { Token } from '../tokens';
import { NodeType } from '../nodes';
import { GSError } from '../util/gserror';
import { sourceFile } from '../..';
import { CallExpr, MemberExpr } from '../ast/expressions.ast';

/**
 * Parse token list into an AST
 */
export default class Parser {
	private tokens: Array<Token> = [];

	/**
	 * Check for <EndOfFile> token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type != NodeType.__EOF__;
	}

	/**
	 *
	 * @returns Returns the current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 * Returns the current token and then shifts the array to the next token
	 */
	private eat(): Token {
		const p = this.tokens.shift() as Token;
		return p;
	}

	/**
	 * Checks the current token NodeType to the expected NodeType shifts array to next token.
	 * If NodeType is not of the expected type, an error will be thrown.
	 *
	 * @returns The current token
	 */
	private expect(type: NodeType, errMsg: string): Token {
		const p = this.tokens.shift() as Token;
		if (!p || p.type != type) {
			console.error(
				new GSError(
					`ParseError`,
					`${errMsg}`,
					`${sourceFile || 'GSREPL'}:${p.__GSC._POS.Line}:${
						p.__GSC._POS.Column
					}`
				)
			);
			process.exit(1);
		}

		return p;
	}

	public generateAST(source: string): Program {
		this.tokens = tokenize(source);
		const program: Program = {
			kind: 'Program',
			body: [],
		};

		// Parse unti end of file
		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		return program;
	}

	// [STATEMENT PARSING]

	private parseStatement(): STATEMENT {
		switch (this.current().type) {
			case NodeType.Let:
			case NodeType.Const:
				return this.parseVarDeclaration();

			default:
				return this.parseExpr();
		}
	}

	private parseBlockStatement(): Array<STATEMENT> {
		this.expect(NodeType.OpenBrace, 'Expected "{" before code block');

		const body: Array<STATEMENT> = [];

		while (this.notEOF() && this.current().type !== NodeType.CloseBrace) {
			const stmt = this.parseStatement();
			body.push(stmt);
		}

		this.expect(NodeType.CloseBrace, 'Expected "}" following code block');

		return body;
	}

	private parseVarDeclaration(): STATEMENT {
		const issConstant = this.eat().type == NodeType.Const;
		const identifier = this.expect(
			NodeType.Identifier,
			'Expected identifier following variable declaration statement.'
		).value;

		if (this.current().type == NodeType.Semicolon) {
			this.eat(); // go past semicolon
			if (issConstant) {
				console.error(
					new GSError(
						`ParseError`,
						`Constant variables must be declared with a value.`,
						`${process.argv[2] || 'GSREPL'}:${
							this.current().__GSC._POS.Line
						}:${this.current().__GSC._POS.Column}`
					)
				);
				process.exit(1);
			}

			return {
				kind: 'VarDeclaration',
				constant: false,
				identifier,
			} as VarDeclaration;
		}

		this.expect(
			NodeType.Equals,
			'Expected "=" following variable identifier.'
		);

		const declaration = {
			kind: 'VarDeclaration',
			value: this.parseExpr(),
			identifier,
			constant: issConstant,
		} as VarDeclaration;

		this.expect(
			NodeType.Semicolon,
			'Expected ";" following variable declaration statement.'
		);

		return declaration;
	}

	private parseFuncDeclaration(): STATEMENT {
		this.eat(); // advance past "func" keyword
		const name = this.expect(
			NodeType.Identifier,
			'Expected identifier following "func" keyword'
		).value;

		const args = this.parseArgs();
		const params: Array<string> = [];
		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				console.log(
					new GSError(
						'ParseError',
						'Expected parameters to be of type string',
						`${sourceFile}:unknown:unknown`
					)
				);
				process.exit(1);
			}

			params.push((arg as Identifier).symbol);
		}

		const body: Array<STATEMENT> = this.parseBlockStatement();

		const func = {
			kind: 'FuncDeclaration',
			name,
			body,
			parameters: params,
		} as FuncDeclaration;

		return func;
	}

	private parseArgs(): Array<EXPRESSION> {
		this.expect(NodeType.OpenParen, 'Expected "(" before parameter list');
		const args =
			this.current().type == NodeType.CloseParen
				? []
				: this.parseArgumentsList();

		this.expect(
			NodeType.CloseParen,
			'Expected ")" following parameters list'
		);

		return args;
	}

	private parseArgumentsList(): Array<EXPRESSION> {
		const args = [this.parseAsgExpr()];

		while (this.current().type == NodeType.Comma && this.eat()) {
			args.push(this.parseAsgExpr());
		}

		return args;
	}

	// [EXPRESSION PARSING]

	private parseExpr(): EXPRESSION {
		return this.parseAsgExpr();
	}

	private parseAsgExpr(): EXPRESSION {
		const lhs = this.parseLogOR();
		if (this.current().type == NodeType.Equals) {
			this.eat(); // advance past equals token
			const rhs = this.parseAsgExpr();
			return {
				kind: 'AssignmentExpr',
				value: rhs,
				assigne: lhs,
			} as AssignmentExpr;
		}

		return lhs;
	}

	private parseLogOR(): EXPRESSION {
		const lhs = this.parseLogAND();
		if (this.current().type == NodeType.Or) {
			const rhs = this.parseLogAND();
			return {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op: '||',
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseLogAND(): EXPRESSION {
		const lhs = this.parseBitwiseOR();
		if (this.current().type == NodeType.And) {
			const rhs = this.parseBitwiseOR();
			return {
				kind: 'BinaryExpr',
				rhs,
				lhs,
				op: '&&',
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseBitwiseOR(): EXPRESSION {
		const lhs = this.parseBitwiseXOR();
		if (this.current().type == NodeType.And) {
			const rhs = this.parseBitwiseOR();
			return {
				kind: 'BitwiseExpr',
				rhs,
				lhs,
				op: '|',
			} as BitwiseExpr;
		}

		return lhs;
	}

	private parseBitwiseXOR(): EXPRESSION {
		const lhs = this.parseBitwiseAND();
		if (this.current().type == NodeType.And) {
			const rhs = this.parseBitwiseOR();
			return {
				kind: 'BitwiseExpr',
				rhs,
				lhs,
				op: '^',
			} as BitwiseExpr;
		}

		return lhs;
	}

	private parseBitwiseAND(): EXPRESSION {
		const lhs = this.parseEqualityExpr();
		if (this.current().type == NodeType.And) {
			const rhs = this.parseBitwiseOR();
			return {
				kind: 'BitwiseExpr',
				rhs,
				lhs,
				op: '&',
			} as BitwiseExpr;
		}

		return lhs;
	}

	private parseEqualityExpr(): EXPRESSION {
		let lhs = this.parseBitwiseShift();

		while (['!=', '=='].includes(this.current().value)) {
			const op = this.eat().value;
			const rhs = this.parseEqualityExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseBitwiseShift(): EXPRESSION {
		let lhs = this.parseMultiplicativeExpr();

		while (['>>', '>>>', '<<'].includes(this.current().value)) {
			const op = this.eat().value;
			const rhs = this.parseMultiplicativeExpr();
			lhs = {
				kind: 'BitwiseExpr',
				lhs,
				rhs,
				op,
			} as BitwiseExpr;
		}

		return lhs;
	}

	private parseMultiplicativeExpr(): EXPRESSION {
		let lhs = this.parseAdditiveExpr();

		while (['*', '/', '%'].includes(this.current().value)) {
			const op = this.eat().value;
			const rhs = this.parseAdditiveExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseAdditiveExpr(): EXPRESSION {
		let lhs = this.parseComparisonExpr();

		while (['+', '-'].includes(this.current().value)) {
			const op = this.eat().value;
			const rhs = this.parseComparisonExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseComparisonExpr(): EXPRESSION {
		let lhs = this.parseUnaryExpr();

		while (['<', '>', '<=', '>='].includes(this.current().value)) {
			const op = this.eat().value;
			const rhs = this.parseUnaryExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseUnaryExpr(): EXPRESSION {
		let lhs = this.parseCallMemberExpr();

		while (['++', '--'].includes(this.current().value)) {
			const op = this.eat().value;
			lhs = {
				kind: 'UnaryExpr',
				AsgOp: op,
				assigne: lhs,
			} as UnaryExpr;
		}

		return lhs;
	}

	private parseCallMemberExpr(): EXPRESSION {
		const member = this.parseMemberExpr();

		if (this.current().type == NodeType.OpenParen) {
			return this.parseCallExpr(member);
		}

		return member;
	}

	private parseMemberExpr(): EXPRESSION {
		let object = this.parsePrimary();

		while (
			this.current().type == NodeType.Dot ||
			this.current().type == NodeType.OpenBracket
		) {
			const op = this.eat();
			let property: EXPRESSION;
			let computed: boolean;

			// non-computed, like "foo.bar"
			if (op.type == NodeType.Dot) {
				computed = false;

				property = this.parsePrimary();
				if (property.kind != 'Identifier') {
					console.log(
						new GSError(
							'ParseError',
							'Can not use dot operator without valid identifier',
							`${sourceFile}:unknown:unknown`
						)
					);
					process.exit(1);
				}
			} else {
				// computed, like "foo['bar']"
				computed = true;
				property = this.parseExpr();
				this.expect(
					NodeType.CloseBracket,
					'Expected "]" following computed object member expression'
				);
			}

			object = {
				kind: 'MemberExpr',
				object,
				property,
				computed,
			} as MemberExpr;
		}

		return object;
	}

	private parseCallExpr(caller: EXPRESSION): EXPRESSION {
		let callExpr: EXPRESSION = {
			kind: 'CallExpr',
			caller,
			args: this.parseArgs(),
		} as CallExpr;

		if (this.eat().type == NodeType.OpenParen) {
			callExpr = this.parseCallExpr(callExpr);
		}

		return callExpr;
	}

	private parsePrimary(): EXPRESSION {
		const tk = this.current().type;

		switch (tk) {
			case NodeType.Identifier:
				return {
					kind: 'Identifier',
					symbol: this.eat().value,
				} as Identifier;

			case NodeType.Number:
				return {
					kind: 'NumberLiteral',
					value: parseFloat(this.eat().value),
				} as NumberLiteral;

			case NodeType.String:
				return {
					kind: 'StringLiteral',
					value: this.eat().value,
				} as StringLiteral;

			case NodeType.OpenParen:
				this.eat();
				const value = this.parseExpr();
				this.expect(
					NodeType.CloseParen,
					`Expected ")" and instead saw AST[${value.kind}]`
				);

				return value;

			default:
				console.log(
					new GSError(
						`Uncaught ParseError`,
						`Unexpected token "${this.current().value}"`,
						`${sourceFile || 'GSREPL'}:${
							this.current().__GSC._POS.Line
						}:${this.current().__GSC._POS.Column}`
					)
				);
				process.exit(1);
		}
	}
}
