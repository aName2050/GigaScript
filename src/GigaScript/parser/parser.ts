import { sourceFile } from '../..';
import { EXPRESSION, Program, STATEMENT } from '../ast/ast';
import { VarDeclaration } from '../ast/declarations.ast';
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
	 * Checks if the current token matches the expected type, and throws an error if it doesn't
	 *
	 *
	 * @returns the current token if it matches the expected token
	 */
	private expect(type: NodeType, errNote: string): Token {
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
		}

		return token;
	}

	public generateAST(src: string): Program {
		this.tokens = tokenize(src);

		const program: Program = {
			kind: 'Program',
			body: [],
		};

		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		return program;
	}

	// [STATEMENTS]
	private parseStatement(): STATEMENT {
		switch (this.current().type) {
			case NodeType.Let:
			case NodeType.Const:
				return this.parseVarDeclaration();

			default:
				return this.parseExpr();
		}
	}

	private parseCodeBlock(): Array<STATEMENT> {
		this.expect(NodeType.OpenBrace);

		const body: Array<STATEMENT> = [];

		while (this.notEOF() && this.current().type !== NodeType.CloseBrace) {
			const stmt = this.parseStatement();
			body.push(stmt);
		}

		this.expect(NodeType.CloseBrace);

		return body;
	}

	// [STATEMENTS.DECLARATIONS]

	private parseVarDeclaration(): STATEMENT {
		const isConstant = this.advance().type == NodeType.Const;
		const identifier = this.expect(NodeType.Identifier).value;

		if (this.current().type == NodeType.Semicolon) {
			this.advance();
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
				kind: 'VarDeclaration',
				constant: false,
				identifier,
			} as VarDeclaration;
		}

		this.expect(NodeType.Equals);

		const declaration = {
			kind: 'VarDeclaration',
			value: this.parseExpr(),
			identifier,
			constant: isConstant,
		} as VarDeclaration;

		this.expect(NodeType.Semicolon);

		return declaration;
	}

	// [EXPRESSIONS]
	private parseExpr(): EXPRESSION {
		return {} as EXPRESSION;
	}
}
