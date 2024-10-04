import { TokenID, getTokenByValue, Tokens } from '../lexer/tokens';
import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

import * as GSUtil from './util';
import { SOURCE_FILE } from '..';
import { GSError, TSError } from '../../typescript/GS.types';
import { SpecialError } from '../../typescript/Error.types';

/**
 *
 * @param source The source string to tokenize.
 * @returns An array of tokens.
 */
export function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	const src = source.split('');

	let currPos = { Line: 1, Column: 0 };

	while (src.length > 0) {
		const currentToken = src[0];
		const token: Token | undefined = getTokenByValue(currentToken);
		const tokenPos = { ...currPos };

		if (
			GSUtil.isNumeric(currentToken) ||
			(currentToken == '-' && GSUtil.isNumeric(src[1]))
		) {
			let num = src.shift()!; // set first digit or negative sign
			currPos.Column++;
			let reachedDecPoint = false; // number has a decimal point

			while (src.length > 0) {
				if (src[0] == '.' && !reachedDecPoint) {
					reachedDecPoint = true;
					num += src.shift();
					currPos.Column++;
				} else if (GSUtil.isNumeric(src[0])) {
					num += src.shift();
					currPos.Column++;
				} else break;
			}

			tokens.push(
				GSUtil.createToken(
					TokenID.Literal._Number,
					Node.Literal.NUMBER,
					'Literal',
					num,
					GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
					SOURCE_FILE
				)
			);
		} else if (typeof token == 'object') {
			switch (token.value) {
				case '=':
				case '+':
				case '-':
				case '*':
				case '/':
				case '%':
				case '>':
				case '<':
				case '!':
				case '&':
				case '|':
				case '^':
					// src.shift();
					// currPos.Column++;

					const multiCharTokens: { [key: string]: string[] } = {
						'=': ['=', '=='],
						'+': ['+', '+='],
						'-': ['-', '-='],
						'*': ['*', '*='],
						'/': ['/', '/='],
						'%': ['%', '%='],
						'>': ['>', '>=', '>>', '>>=', '>>>', '>>>='],
						'<': ['<', '<=', '<<', '<<='],
						'!': ['!', '!='],
						'&': ['&', '&&', '&='],
						'|': ['|', '||', '|='],
						'^': ['^', '^='],
					};

					let multiCharToken = token.value;

					const possibleTokens = multiCharTokens[token.value] || [];
					possibleTokens.sort((a, b) => b.length - a.length);

					for (const possibleToken of possibleTokens) {
						if (
							src.slice(0, possibleToken.length).join('') ===
							possibleToken
						) {
							multiCharToken =
								possibleToken as typeof token.value;
							src.splice(0, possibleToken.length);
							currPos.Column += possibleToken.length;
							break;
						}
					}

					tokens.push(
						GSUtil.createToken(
							getTokenByValue(multiCharToken)!.id,
							getTokenByValue(multiCharToken)!.type,
							getTokenByValue(multiCharToken)!.nodeGroup,
							multiCharToken,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE,
							{ isSymbol: true }
						)
					);

					break;

				case '"':
				case "'":
					let str = '';
					const quoteType = src.shift(); // move past opening quote
					currPos.Column++;

					while (
						src.length > 0 &&
						src[0] !== quoteType &&
						!GSUtil.isEOL(src[0]) &&
						src.length != 0
					) {
						if (src[0] == '\\') {
							src.shift();
							currPos.Column++;

							let escSeq = '\\';

							while (src.length > 0 && !GSUtil.isEOL(src[0])) {
								const nextChar = src.shift()!;
								currPos.Column++;
								escSeq += nextChar;

								if (!GSUtil.isSupportedEscapeCharacter(escSeq))
									break;
							}

							str += GSUtil.handleEscapeSequence(escSeq);
						} else {
							str += src.shift();
							currPos.Column++;
						}

						if (GSUtil.isEOL(src[0]) || src.length == 0) {
							throw new GSError(
								SpecialError.SyntaxError,
								'Unterminated string literal',
								`${SOURCE_FILE}:${currPos.Line}:${currPos.Column}`
							);
						}
					}

					src.shift();
					currPos.Column++;

					tokens.push(
						GSUtil.createToken(
							TokenID.Literal._String,
							Node.Literal.STRING,
							'Literal',
							str,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE,
							{ charArray: str.split(''), symbol: false }
						)
					);

					break;

				default:
					currPos.Column++;
					tokens.push(
						GSUtil.createToken(
							token.id,
							token.type,
							token.nodeGroup,
							token.value,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE,
							{ isSymbol: true }
						)
					);
					src.shift();
					break;
			}
		} else {
			if (GSUtil.isAlpha(currentToken)) {
				let ident: string = '';
				ident += src.shift();
				currPos.Column++;

				while (src.length > 0 && GSUtil.isAlpha(src[0], true)) {
					ident += src.shift();
					currPos.Column++;
				}

				const RESERVED = Tokens[ident];
				if (typeof RESERVED == 'object') {
					tokens.push(
						GSUtil.createToken(
							RESERVED.id,
							RESERVED.type,
							RESERVED.nodeGroup,
							RESERVED.value,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE,
							{ reservedKeyword: true }
						)
					);
				} else {
					tokens.push(
						GSUtil.createToken(
							TokenID.Literal._Identifier,
							Node.Literal.IDENTIFIER,
							'Literal',
							ident,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE,
							{ userCreatedSymbol: true }
						)
					);
				}
			} else if (GSUtil.isEOL(currentToken)) {
				// end of current line
				currPos.Line++;
				src.shift();
				currPos.Column = 1;
				tokenPos.Column = 1;
			} else if (GSUtil.isWhitespace(currentToken)) {
				src.shift();
				currPos.Column++;
			} else {
				throw new GSError(
					SpecialError.SyntaxError,
					`Unknown character: ${currentToken} (unicode ${currentToken.charCodeAt(
						0
					)})`,
					`${SOURCE_FILE}:${tokenPos.Line}:${tokenPos.Column}`
				);
			}
		}
	}

	tokens.push(
		GSUtil.createToken(
			TokenID.Special.__EOF__,
			Node.Special.__EOF__,
			'Special',
			'<EOF>',
			GSUtil.tokenPos(
				{ ...currPos },
				{ Line: currPos.Line, Column: currPos.Column + 1 }
			),
			SOURCE_FILE,
			{ END_OF_FILE: true, AUTO_GENERATED: true }
		)
	);

	return tokens;
}
