import { SOURCE_FILE } from '..';
import { Expression, Program, Statement } from '../ast/core.ast';
import {
	Identifier,
	NumberLiteral,
	StringLiteral,
} from '../ast/literals/literals.ast';
import { tokenize } from '../lexer/tokenizer';
import { getTokenById, TokenType } from '../lexer/tokens';
import { GSError, SpecialError, Token } from '../types';
import ParseDeclaration from './handlers/declarations.parser';
import { formatErrorLocation, getTokenName } from './util';

export default class Parser {
	private tokens: Token[] = [];

	/**
	 *
	 * @returns Whether the current token is an EndOfFile token
	 */
	private isEOF(): boolean {
		return this.tokens[0].id == TokenType.___EOF___;
	}

	/**
	 *
	 * @returns The current token
	 */
	private currentToken(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 *
	 * @returns The next token
	 */
	private nextToken(): Token {
		return this.tokens[1] as Token;
	}

	/**
	 *
	 * @returns The current token and shifts token array
	 */
	private advance(): Token {
		return this.tokens.shift() as Token;
	}

	public Util = {
		isEOF: this.isEOF,
		currentToken: this.currentToken,
		nextToken: this.nextToken,
		expect: this.expect,
		advance: this.advance,
	};

	private expect(id: Token['id'], errNote = ''): Token {
		const token = this.advance() as Token;
		if (!token || token.id != id) {
			throw new GSError(
				SpecialError.ParseError,
				`Expected "${getTokenName(
					id
				)}"${errNote}, instead saw "${getTokenName(token.id)}"`,
				`${SOURCE_FILE}:${formatErrorLocation(token)}`
			);
		}

		return token;
	}

	public get Tokens(): Token[] {
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

		while (!this.isEOF()) {
			program.body.push(this.parseStatement());
		}

		const EOFToken = this.currentToken();
		if (EOFToken.id != TokenType.___EOF___)
			throw new GSError(
				SpecialError.ParseError,
				'Missing <EOF> token. File may be corrupted',
				`${SOURCE_FILE}:${formatErrorLocation(this.currentToken())}`
			);

		program.end = EOFToken._GSC.Position.End;

		return program;
	}

	public parseStatement(): Statement {
		switch (this.currentToken().id) {
			case TokenType.Declare:
				return ParseDeclaration(this);

			default:
				return this.parseExpression();
		}
	}

	public parseExpression(): Expression {
		return this.parsePrimaryExpression();
	}

	public parsePrimaryExpression(): Expression {
		const token = this.currentToken();

		switch (token.id) {
			case TokenType.__Identifier:
				return {
					kind: 'Identifier',
					symbol: this.advance().raw,
					start: token._GSC.Position.Start,
					end: token._GSC.Position.End,
				} as Identifier;

			case TokenType.__Number:
				return {
					kind: 'NumberLiteral',
					value: parseFloat(this.advance().raw),
					start: token._GSC.Position.Start,
					end: token._GSC.Position.End,
				} as NumberLiteral;

			case TokenType.__String:
				return {
					kind: 'StringLiteral',
					value: this.advance().raw,
					start: token._GSC.Position.Start,
					end: token._GSC.Position.End,
				} as StringLiteral;

			case TokenType.OpenParentheses:
				this.advance();
				const value = this.parseExpression();
				this.expect(TokenType.CloseParentheses);

				return value;

			default:
				throw new GSError(
					SpecialError.ParseError,
					`Uncaught: Unexpected token "${
						getTokenById(this.currentToken().id)?.raw
					}`,
					`${SOURCE_FILE}:${formatErrorLocation(this.currentToken())}`
				);
		}
	}
}
