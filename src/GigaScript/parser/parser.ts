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
import { Token, TokenID } from '../tokens';
import { NodeType } from '../nodes';
import { GSError } from '../util/gserror';
import { sourceFile } from '../..';

/**
 * Parse token list into an AST
 */
export default class Parser {
	private tokens: Token[] = [];

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
					`ParseError: ${errMsg}`,
					`Expected NodeType[${type}], instead saw NodeType[${p.type}]`,
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
		let lhs = this.parsePrimary();

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
					`Expected ")" and instead saw ${value}`
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
