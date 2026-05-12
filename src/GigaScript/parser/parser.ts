import { Token } from '../../types/token';
import { NodeType } from '../../types/token.node';
import { tokenize } from '../lexer/tokenizer';

export default class Parser {
	private tokens: Array<Token> = [];

	/**
	 * Checks if the current token is not the end-of-file token
	 * @returns Whether the current token is not the end-of-file token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type !== NodeType.__EOF__;
	}

	/**
	 * Peeks at the token at the specified offset
	 * @param offset The offset to peek at (default: 0)
	 * @returns The token at the specified offset
	 */
	private peek(offset = 0): Token {
		return this.tokens[offset];
	}

	/**
	 * Advances the token stream by one and returns the next token
	 * @returns The next token in the stream
	 */
	private advance(): Token {
		return this.tokens.shift()!;
	}

	/**
	 * Expects the next token to be of a certain type and advances the stream if it is, otherwise throws an error
	 * @param type The expected token type
	 * @returns The next token in the stream if it is of the expected type
	 * @throws Error if the next token is not of the expected type
	 */
	private expect(type: NodeType): Token {
		const token = this.peek();
		if (token.type !== type) {
			throw new Error(
				`Expected token of type ${NodeType[type]}, but got ${NodeType[token.type]} at ${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`,
			);
		}
		return this.advance();
	}

	public set Tokens(tokens: Array<Token>) {
		this.tokens = tokens;
	}

	public get Tokens(): Array<Token> {
		return this.tokens;
	}

	public tokenizeSource(src: string): void {
		this.tokens = tokenize(src);
	}
}
