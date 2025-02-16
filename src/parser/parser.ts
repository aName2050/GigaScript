import { SOURCE_FILE } from '..';
import { Program } from '../ast/core.ast';
import { tokenize } from '../lexer/tokenizer';
import { TokenType } from '../lexer/tokens';
import { GSError, SpecialError, Token } from '../types';
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
				line: 1,
				column: 1,
			},
			end: {
				line: 1,
				column: 1,
			},
		};

		while (!this.isEOF()) {
			// TODO:
		}

		const EOFToken = this.currentToken();
		if (EOFToken.id != TokenType.___EOF___)
			throw new GSError(
				SpecialError.ParseError,
				'Missing <EOF> token. File may be corrupted',
				`${SOURCE_FILE}:${formatErrorLocation(this.currentToken())}`
			);

		program.end = {
			line: EOFToken._GSC.Position.End.Line,
			column: EOFToken._GSC.Position.End.Column,
		};

		return program;
	}
}
