import { sourceFile } from '../..';
import { GSX_Tokens, createGSXToken, getGSXTokenByValue } from '../gsx.tokens';
import { NodeType } from '../nodes';
import { Token, TokenID } from '../tokens';
import { GSError } from '../util/gserror';
import { OpPrec } from './types';
import {
	handleEscSeq,
	isAlpha,
	isEOL,
	isInt,
	isValidEscapeChar,
	isWhitespace,
} from './util';

/**
 *
 * @param source The source file
 * @returns An array of tokens
 */
export function tokenizeGSX(source: string): Token[] {
	const tokens: Array<Token> = new Array<Token>();
	const src = source.split('');

	let line = 1,
		col = 1;

	while (src.length > 0) {
		const curr = src[0];
		const token: Token | undefined = getGSXTokenByValue(curr);
		const tokenPos = { line, Col: col };

		if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
			let num = src.shift()!;
			col++;
			let reachedDecPoint = false;

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
				createGSXToken(
					TokenID._Number,
					NodeType.Number,
					num,
					{
						start: {
							line: tokenPos.line,
							column: tokenPos.Col,
						},
						end: {
							line,
							column: col,
						},
					},
					OpPrec.None
				)
			);
		} else if (typeof token == 'object') {
			switch (token.value) {
				// case '=':
				// 	{
				// 		src.shift();
				// 		col++;
				// 		const multiCharToken = src[0] === '=' ? '==' : '=';
				// 		if (multiCharToken.length == 2) {
				// 			src.shift(); // advance past second character
				// 			col++;
				// 		}
				// 		tokens.push({
				// 			...GSX_Tokens[multiCharToken],
				// 			__GSC: {
				// 				_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
				// 				_POS: {
				// 					start: {
				// 						Line: tokenPos.line,
				// 						Column: tokenPos.Col,
				// 					},
				// 					end: {
				// 						Line: line,
				// 						Column: col,
				// 					},
				// 				},
				// 			},
				// 		});
				// 	}
				// 	break;

				case '+':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] == '+' ? '++' : '';

						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '-':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] == '-' ? '--' : '';

						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '*':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] == '=' ? '*=' : '';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '/':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '/=' : '';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '%':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '%=' : '%';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '>':
					{
						src.shift();
						col++;
						let multiCharToken: '' | '>>' | '>>=' | '>>>' | '>>>=';

						if (src[0] === '>' && src[1] === '>' && src[2] === '=')
							multiCharToken = '>>>=';
						else if (src[0] === '>' && src[1] === '>')
							multiCharToken = '>>>';
						else if (src[0] === '>' && src[1] === '=')
							multiCharToken = '>>=';
						else if (src[0] === '>') multiCharToken = '>>';
						else multiCharToken = '';

						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						} else if (multiCharToken.length == 3) {
							src.shift(); // advance past second character
							col++;
							src.shift(); // advance past third character
							col++;
						} else if (multiCharToken.length == 4) {
							src.shift(); // advance past second character
							col++;
							src.shift(); // advance past third character
							col++;
							src.shift(); // advance past fourth character
							col++;
						}

						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '<':
					{
						src.shift();
						col++;
						let multiCharToken: '' | '<<' | '<<=';

						if (src[0] === '<' && src[1] === '=')
							multiCharToken = '<<=';
						else if (src[0] === '<') multiCharToken = '<<';
						else multiCharToken = '';

						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						} else if (multiCharToken.length == 3) {
							src.shift(); // advance past second character
							col++;
							src.shift(); // advance past third character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '!':
					{
						src.shift();
						col++;

						tokens.push({
							...GSX_Tokens['!'],
							__GSC: {
								_OPC: GSX_Tokens['!'].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '&':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '&=' : '&';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '|':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '|=' : '|';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '^':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '^=' : '^';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case '~':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '~=' : '~';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...GSX_Tokens[multiCharToken],
							__GSC: {
								_OPC: GSX_Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									start: {
										Line: tokenPos.line,
										Column: tokenPos.Col,
									},
									end: {
										Line: line,
										Column: col,
									},
								},
							},
						});
					}
					break;

				case "'":
				case '"':
					let str = '';
					const quoteType = src.shift(); // move past opening doubleQuotes/singleQuotes
					col++;

					while (
						src.length > 0 &&
						src[0] !== quoteType &&
						!isEOL(src[0]) &&
						src.length != 0
					) {
						if (src[0] === '\\') {
							src.shift(); // skip past backslash (escape character)
							col++;

							let escSeq = '\\';

							while (src.length > 0 && !isEOL(src[0])) {
								const nextChar = src.shift()!;
								col++;
								escSeq += nextChar;

								if (!isValidEscapeChar(nextChar)) {
									break;
								}
							}

							str += handleEscSeq(escSeq);
						} else {
							str += src.shift();
							col++;
						}
					}

					if (isEOL(src[0]) || src.length == 0) {
						throw new GSError(
							`LexerError`,
							`Unterminated string literal`,
							`${sourceFile || 'GSREPL'}:${tokenPos.line}:${
								tokenPos.Col
							}`
						);
					}

					src.shift(); // move past closing doubleQuotes/singleQuotes
					col++;

					tokens.push(
						createGSXToken(TokenID._String, NodeType.String, str, {
							start: {
								line: tokenPos.line,
								column: tokenPos.Col,
							},
							end: {
								line: line,
								column: col,
							},
						})
					);

					break;

				default:
					col++;
					// matches single character tokens
					tokens.push(
						createGSXToken(
							token.id,
							token.type,
							token.value,
							{
								start: {
									line: tokenPos.line,
									column: tokenPos.Col,
								},
								end: {
									line: line,
									column: col,
								},
							},
							token.__GSC._OPC
						)
					);
					src.shift();
					break;
			}
		} else {
			switch (curr) {
				default:
					if (isAlpha(curr)) {
						let ident: string = '';
						ident += src.shift();
						col++;

						while (src.length > 0 && isAlpha(src[0], true)) {
							ident += src.shift();
							col++;
						}

						const RESERVED = GSX_Tokens[ident];
						if (typeof RESERVED == 'object') {
							tokens.push(
								createGSXToken(
									RESERVED.id,
									RESERVED.type,
									RESERVED.value,
									{
										start: {
											line: tokenPos.line,
											column: tokenPos.Col,
										},
										end: {
											line,
											column: col,
										},
									},
									RESERVED.__GSC._OPC
								)
							);
						} else {
							tokens.push(
								createGSXToken(
									TokenID._Identifier,
									NodeType.Identifier,
									ident,
									{
										start: {
											line: tokenPos.line,
											column: tokenPos.Col,
										},
										end: {
											line,
											column: col,
										},
									},
									OpPrec.None
								)
							);
						}
					} else if (isEOL(curr)) {
						line++;
						src.shift();
						col = 1;
						tokenPos.Col = 1;
					} else if (isWhitespace(curr)) {
						src.shift() && col++;
					} else {
						throw new GSError(
							'LexerError',
							`Unknown character: UNICODE-${curr.charCodeAt(
								0
							)} "${curr}"`,
							`${sourceFile}:${tokenPos.line}:${tokenPos.Col}`
						);
					}
			}
		}
	}

	tokens.push(
		createGSXToken(
			TokenID.__EOF__,
			NodeType.__EOF__,
			'<EOF>',
			{
				start: {
					line,
					column: col,
				},
				end: {
					line,
					column: col + 1,
				},
			},
			OpPrec.None
		)
	);

	return tokens;
}
