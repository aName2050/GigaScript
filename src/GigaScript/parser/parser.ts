import { Program } from '../ast/ast';
import { tokenize } from '../lexer/tokenizer';
import { NodeType } from '../nodes';
import { Token, getTokenByTypeEnum } from '../tokens';
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
	 * @returns the current token if it matches the expected token
	 */
	private expect(type: NodeType): Token {
		const token = this.tokens.shift() as Token;
		if (!token || token.type != type) {
			// console.log(new ParseError(`Expected `))
			getTokenByTypeEnum(2);
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
			program.body.push();
		}

		return program;
	}
}
