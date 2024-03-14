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

	let line = 1;
	let col = 1;

	// Loop until <EOF>
	while (src.length > 0) {
		const curr = src[0];
		const token: Token | undefined = getTokenByValue(curr);
		const tokenPos = { line, Col: col };

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
					tokenPos.line,
					tokenPos.Col,
					OpPrec.None
				)
			);
		} else if (typeof token == 'object') {
			switch (token.value) {
				case '=':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '==' : '=';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '+':
					{
						src.shift();
						col++;
						const multiCharToken =
							src[0] === '=' ? '+=' : src[0] === '+' ? '++' : '+';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '-':
					{
						src.shift();
						col++;
						const multiCharToken =
							src[0] === '=' ? '-=' : src[0] === '-' ? '--' : '-';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '*':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '*=' : '*';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '/':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '/=' : '/';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
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
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '>':
					{
						src.shift();
						col++;
						let multiCharToken:
							| '>'
							| '>='
							| '>>'
							| '>>='
							| '>>>'
							| '>>>=';

						if (src[0] === '>' && src[1] === '>' && src[2] === '=')
							multiCharToken = '>>>=';
						else if (src[0] === '>' && src[1] === '>')
							multiCharToken = '>>>';
						else if (src[0] === '>' && src[1] === '=')
							multiCharToken = '>>=';
						else if (src[0] === '>') multiCharToken = '>>';
						else if (src[0] === '=') multiCharToken = '>=';
						else multiCharToken = '>';

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
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '<':
					{
						src.shift();
						col++;
						let multiCharToken: '<=' | '<' | '<<' | '<<=';

						if (src[0] === '<' && src[1] === '=')
							multiCharToken = '<<=';
						else if (src[0] === '<') multiCharToken = '<<';
						else if (src[0] === '=') multiCharToken = '<=';
						else multiCharToken = '<';

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
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '!':
					{
						src.shift();
						col++;
						const multiCharToken = src[0] === '=' ? '!=' : '!';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '&':
					{
						src.shift();
						col++;
						const multiCharToken =
							src[0] === '&' ? '&&' : src[0] === '=' ? '&=' : '&';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				case '|':
					{
						src.shift();
						col++;
						const multiCharToken =
							src[0] === '|' ? '||' : src[0] === '=' ? '|=' : '|';
						if (multiCharToken.length == 2) {
							src.shift(); // advance past second character
							col++;
						}
						tokens.push({
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
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
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
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
							...Tokens[multiCharToken],
							__GSC: {
								_OPC: Tokens[multiCharToken].__GSC._OPC,
								_POS: {
									Line: tokenPos.line,
									Column: tokenPos.Col,
								},
							},
						});
					}
					break;

				default:
					// matches single character tokens
					tokens.push(
						createToken(
							token.id,
							token.type,
							token.value,
							tokenPos.line,
							tokenPos.Col,
							token.__GSC._OPC
						)
					);
					src.shift() && col++;
					break;
			}
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
						if (typeof RESERVED == 'object') {
							tokens.push(
								createToken(
									RESERVED.id,
									RESERVED.type,
									RESERVED.value,
									tokenPos.line,
									tokenPos.Col,
									RESERVED.__GSC._OPC
								)
							);
						} else {
							// user defined symbol
							tokens.push(
								createToken(
									TokenID._Identifier,
									NodeType.Identifier,
									ident,
									tokenPos.line,
									tokenPos.Col,
									OpPrec.None
								)
							);
						}
					} else if (isEOL(curr)) {
						// end of current line
						line++;
						src.shift();
						col = 1;
						tokenPos.Col = 1;
					} else if (isWhitespace(curr)) {
						src.shift() && col++;
					} else {
						console.error(
							`LexerError: Unknown character: UNICODE-${curr.charCodeAt(
								0
							)} ${curr}`
						);
						process.exit(1);
					}
			}
		}
	}

	tokens.push(
		createToken(
			TokenID.__EOF__,
			NodeType.__EOF__,
			'<EOF>',
			line,
			col,
			OpPrec.None
		)
	);

	// console.log(tokens);

	return tokens;
}
