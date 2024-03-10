/**
 * tokenizer.ts
 *
 * Tokenizes inputted GigaScript code for parsing
 */

import { TokenID, Token, Tokens, getTokenByValue } from '../tokens';
import { NodeType } from '../nodes';
import { createToken, isAlpha, isEOL, isInt, isWhitespace } from './util';
import { OpPrec } from './types';

/**
 *
 * @param source The source file
 * @returns An array of tokens
 */
export function tokenize(source: string): Token[] {
	const tokens: Array<Token> = new Array<Token>();
	const src = source.split('');

	let line = 0;
	let col = 0;

	// Loop until <EOF>
	while (src.length > 0) {
		const curr = src[0];
		const token: Token | undefined = getTokenByValue(curr);

		if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
			let num = src.shift()!; // set first digit or negative sign
			col++;
			let reachedDecPoint = false; // number has a decimal point

			while (src.length > 0) {
				if (src[0] == '.' && !reachedDecPoint) {
					reachedDecPoint = true;
					num += src.shift();
					col++;
				} else if (isInt(src[0])) {
					num += src.shift();
					col++;
				} else break;
			}

			tokens.push(
				createToken(
					TokenID._Number,
					NodeType.Number,
					num,
					line,
					col,
					OpPrec.None
				)
			);
		} else {
			switch (curr) {
				default:
					if (isAlpha(curr)) {
						// first char of an identifier can't be a number
						let ident: string = '';
						ident += src.shift();
						col++;

						while (src.length > 0 && isAlpha(src[0], true)) {
							// rest of identifier can contain numbers
							ident += src.shift();
							col++;
						}

						// check for reserved keywords
						const RESERVED = Tokens[ident];
						if (typeof RESERVED == 'number') {
							// tokens.push(createToken(RESERVED[], NodeType.Identifier, ident))
						}
					}
			}
		}
	}

	return tokens;
}
