import { SOURCE_FILE } from '..';
import { Token, TokenPos } from '../types';
import { getTokenByRawValue, TokenType } from './tokens';
import * as GSLexerUtil from './util';

export function tokenize(source: string): Token[] {
	const tokens: Token[] = new Array<Token>();
	const src: string[] = source.split('');

	let currentPosition: TokenPos['Start'] = { Line: 1, Column: 0 };

	while (src.length > 0) {
		const currentCharacter: string = src[0];
		const nextCharacter: string = src[1];
		const token: Token | undefined = getTokenByRawValue(currentCharacter);
		const tokenPosition: TokenPos['Start'] = { ...currentPosition };

		if (
			GSLexerUtil.isNumeric(currentCharacter) ||
			(currentCharacter == '-' && GSLexerUtil.isNumeric(nextCharacter))
		) {
			let num: string = src.shift()!; // get the first digit or negative sign
			currentPosition.Column++; // increment column
			let foundDecimalPoint: boolean = false; // a number can only have one decimal point

			while (src.length > 0) {
				// we are using `src[0]` here instead of `currentCharacter`
				// because `currentCharacter` would hold the value from before
				// we called `src.shift()`
				if (src[0] == '.' && !foundDecimalPoint) {
					foundDecimalPoint = true;
					num += src.shift(); // add decimal point to number
					currentPosition.Column++; // increment column
				} else if (GSLexerUtil.isNumeric(src[0])) {
					num += src.shift(); // add next digit to number
					currentPosition.Column++; // increment column
				} else break; // break out of the loop if there are no more numeric values
			}

			// create a new token and push it into the array
			tokens.push(
				GSLexerUtil.createToken(
					TokenType.__Number,
					num,
					GSLexerUtil.tokenPosition(
						// contains the location of the token character
						{ ...tokenPosition },
						// contains the current position the tokenizer is at,
						// which should be the last character of the token
						{ ...currentPosition }
					),
					SOURCE_FILE
				)
			);
		} else if (typeof token == 'object') {
			// if the token is a symbol or keyword
			switch (token.raw) {
				case '.':
				case '#':
				case '!':
				case ':':
					// all multi-character tokens using symbols
					const multiCharacterTokens: { [key: string]: string[] } = {
						'.': ['.'],
						'#': ['#', '#!'],
						'!': ['!'],
						':': [':'],
					};

					let multiCharacterToken: string = token.raw;

					// list all possible tokens that may match
					const possibleTokens: string[] =
						multiCharacterTokens[token.raw] || [];
					possibleTokens.sort((a, b) => b.length - a.length);

					for (const possibleToken of possibleTokens) {
						if (
							src.slice(0, possibleToken.length).join('') ===
							possibleToken
						) {
							multiCharacterToken =
								possibleToken as typeof token.raw;
							// remove characters from source array
							src.splice(0, possibleToken.length);
							// increment column by number of characters in the token
							currentPosition.Column += possibleToken.length;
							break;
						}
					}

					const tokenData: Token =
						getTokenByRawValue(multiCharacterToken)!;

					tokens.push(
						GSLexerUtil.createToken(
							tokenData.id,
							tokenData.raw,
							GSLexerUtil.tokenPosition(
								{ ...tokenPosition },
								{ ...currentPosition }
							),
							SOURCE_FILE
						)
					);

					break;

				case '"':
				case "'":
					// handle strings
					let str = '';
					// move past opening quote storing to compare
					// it to the closing quotes
					const quoteType = src.shift();
					currentPosition.Column++; // increment column

					// only loop if their are still more characters in the src array
					// and the end of the string has not been reached
					// and there isn't the end of the line
					// multiline strings are not supported in GigaScript
					while (
						src.length > 0 &&
						src[0] !== quoteType &&
						!GSLexerUtil.isEOL(src[0])
					) {
						// check for an escape sequence
						if (src[0] == '\\') {
							src.shift();
							currentPosition.Column++;

							let escSeq: string = '\\';

							while (
								src.length > 0 &&
								!GSLexerUtil.isEOL(src[0])
							) {
								const nextChar = src.shift();
								currentPosition.Column++;
								escSeq += nextChar;

								if (
									!GSLexerUtil.isAllowedEscapeCharacter(
										escSeq
									)
								)
									break;
							}

							str += GSLexerUtil.handleEscapeSequence(escSeq);
						} else {
							str += src.shift();
							currentPosition.Column++;
						}

						if (GSLexerUtil.isEOL(src[0])) throw new
					}
			}
		}
	}

	return tokens;
}
