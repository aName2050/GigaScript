import { SOURCE_FILE } from '..';
import { GSError, SpecialError, Token, TokenPos } from '../types';
import { getTokenByRawValue, Tokens, TokenType } from './tokens';
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

						if (GSLexerUtil.isEOL(src[0]) || src.length == 0)
							throw new GSError(
								SpecialError.SyntaxError,
								'Unterminated string literal',
								`${SOURCE_FILE}:${GSLexerUtil.formatPosition(
									currentPosition
								)}`
							);
					}

					src.shift();
					currentPosition.Column++;

					tokens.push(
						GSLexerUtil.createToken(
							TokenType.__String,
							str,
							GSLexerUtil.tokenPosition(
								{ ...tokenPosition },
								{ ...currentPosition }
							),
							SOURCE_FILE,
							{
								charArray: str.split(''),
								displayed: quoteType + str + quoteType,
							}
						)
					);

					break;

				default:
					currentPosition.Column++;
					tokens.push(
						GSLexerUtil.createToken(
							token.id,
							token.raw,
							GSLexerUtil.tokenPosition(
								{ ...tokenPosition },
								{ ...currentPosition }
							),
							SOURCE_FILE
						)
					);
					src.shift();
					break;
			}
		} else {
			if (GSLexerUtil.isAlpha(currentCharacter)) {
				let identifier: string = '';
				identifier += src.shift();
				currentPosition.Column++;

				while (src.length > 0 && GSLexerUtil.isAlphanumeric(src[0])) {
					identifier += src.shift();
					currentPosition.Column++;
				}

				const reserved: Token = Tokens[identifier];
				if (typeof reserved == 'object') {
					tokens.push(
						GSLexerUtil.createToken(
							reserved.id,
							reserved.raw,
							GSLexerUtil.tokenPosition(
								{ ...tokenPosition },
								{ ...currentPosition }
							),
							SOURCE_FILE,
							{
								isReservedKeyword: true,
								userCreatedIdentifier: false,
							}
						)
					);
				} else {
					tokens.push(
						GSLexerUtil.createToken(
							TokenType.__Identifier,
							identifier,
							GSLexerUtil.tokenPosition(
								{ ...tokenPosition },
								{ ...currentPosition }
							),
							SOURCE_FILE,
							{
								isReservedKeyword: false,
								userCreatedIdentifier: true,
							}
						)
					);
				}
			} else if (GSLexerUtil.isEOL(currentCharacter)) {
				// end of line reached
				// increment current line counter
				// reset current column counter

				if (src[0] == '\r' && src[1] == '\n') {
					src.shift();
					src.shift();
				} else src.shift();
				currentPosition.Line++;
				currentPosition.Column = 1;
				tokenPosition.Column = 1;
			} else if (GSLexerUtil.isWhitespace(currentCharacter)) {
				// whitespace characters can be ignored
				// whitespace characters do not provide anything
				// to the program
				src.shift();
				currentPosition.Column++;
			} else {
				throw new GSError(
					SpecialError.SyntaxError,
					`Unknown character: ${currentCharacter} (U-${currentCharacter.charCodeAt(
						0
					)})`,
					`${SOURCE_FILE}:${GSLexerUtil.formatPosition(
						currentPosition
					)}`
				);
			}
		}
	}

	// push the EndOfFile token at the end to indicate the end of the file
	// as well as the expected end of the tokens list
	tokens.push(
		GSLexerUtil.createToken(
			TokenType.___EOF___,
			'<EOF>',
			GSLexerUtil.tokenPosition(
				{ ...currentPosition },
				{
					Line: currentPosition.Line,
					Column: currentPosition.Column + 1,
				}
			),
			SOURCE_FILE,
			{ END_OF_FILE: true, AUTO_GEN: true }
		)
	);

	return tokens;
}
