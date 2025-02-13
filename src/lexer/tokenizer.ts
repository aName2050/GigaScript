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
					)
				)
			);
		} else if (typeof token == 'object') {
			// if the token is a symbol or keyword
			switch (token.raw) {
				case '.':
				case '#':
				case '!':
				case ':':
					const multiCharacterTokens: { [key: string]: string[] } = {
						'.': ['.'],
						'#': ['#', '#!'],
						'!': ['!'],
						':': [':'],
					};

					let multiCharacterToken: string = token.raw;

					const possibleTokens =
						multiCharacterTokens[token.raw] || [];
					possibleTokens.sort((a, b) => b.length - a.length);

					for (const possibleToken of possibleTokens) {
						if (
							src.slice(0, possibleToken.length).join('') ===
							possibleToken
						) {
							multiCharacterToken =
								possibleToken as typeof token.raw;
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
							)
						)
					);
			}
		}
	}

	return tokens;
}
