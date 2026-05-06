import { SOURCE_FILE } from '../..';
import { Token } from '../../types/token';
import { NodeType } from '../../types/token.node';
import { Symbol } from '../../types/token.symbol';
import { generateToken } from '../../util/generateToken';
import { GigaScriptError } from '../../util/GSError';
import { isAlpha, isEOL, isInt, isWhitespace } from '../../util/lexer.util';
import { getTokenByValue } from './declarations';

export function tokenize(source: string): Token[] {
	const tokens: Array<Token> = new Array<Token>();
	const src = source.split('');

	let currentPosition: { Line: number; Column: number } = {
		Line: 1,
		Column: 1,
	};

	// Helper functions
	const determineMultiCharToken = (char: string): [string, number] => {
		switch (char) {
			case '=':
				return src[0] === '=' ? ['==', 1] : ['=', 0];
			case '+':
				if (src[0] === '=') return ['+=', 1];
				if (src[0] === '+') return ['++', 1];
				return ['+', 0];
			case '-':
				if (src[0] === '=') return ['-=', 1];
				if (src[0] === '-') return ['--', 1];
				return ['-', 0];
			case '*':
				return src[0] === '=' ? ['*=', 1] : ['*', 0];
			case '/':
				return src[0] === '=' ? ['/=', 1] : ['/', 0];
			case '%':
				return src[0] === '=' ? ['%=', 1] : ['%', 0];
			default:
				return [char, 0];
		}
	};

	// START OF TOKENIZER
	tokens.push(
		generateToken(Symbol.__SOF__, NodeType.__SOF__, '<!SOF>', {
			start: { Line: null, Column: null },
			end: { Line: null, Column: null },
		}),
	);

	while (src.length > 0) {
		const current = src[0];
		const next = src[1];
		const next2 = src[2];

		const token: Token | undefined = getTokenByValue(current);
		const tokenPosition: { Line: number; Column: number } = currentPosition;

		if (isInt(current) || (current == '-' && isInt(next))) {
			let number = src.shift()!;
			currentPosition.Column++;
			let reachedDecimalPoint = false;

			while (src.length > 0) {
				if (src[0] == '.' && !reachedDecimalPoint) {
					number += src.shift();
					currentPosition.Column++;
					reachedDecimalPoint = true;
				} else if (isInt(src[0])) {
					number += src.shift();
					currentPosition.Column++;
				} else break;
			}

			tokens.push(
				generateToken(Symbol._Number, NodeType.Number, number, {
					start: tokenPosition,
					end: {
						Line: currentPosition.Line,
						Column: currentPosition.Column,
					},
				}),
			);
		} else if (typeof token == 'object') {
			// handle symbols that can be more than 1 character (e.g. ==, +=, etc.)
			const [determinedToken, charsConsumed] =
				determineMultiCharToken(current);
			if (determinedToken !== current) {
				src.shift(); // consume the first character
				currentPosition.Column++;
				for (let i = 0; i < charsConsumed; i++) {
					src.shift(); // consume the additional character(s)
					currentPosition.Column++;
				}
			} else {
				src.shift(); // consume the symbol character
				currentPosition.Column++;
			}

			tokens.push(
				generateToken(
					getTokenByValue(determinedToken)!.symbol,
					getTokenByValue(determinedToken)!.type,
					determinedToken,
					{
						start: tokenPosition,
						end: {
							Line: currentPosition.Line,
							Column: currentPosition.Column,
						},
					},
				),
			);
		} else {
			switch (current) {
				default:
					if (isAlpha(current)) {
						let identifier: string = src.shift()!;
						currentPosition.Column++;

						while (src.length > 0) {
							if (
								isAlpha(src[0]) ||
								isInt(src[0]) ||
								src[0] == '_'
							) {
								identifier += src.shift();
								currentPosition.Column++;
							} else break;
						}

						const keywordToken = getTokenByValue(identifier);
						if (keywordToken) {
							tokens.push(
								generateToken(
									keywordToken.symbol,
									keywordToken.type,
									identifier,
									{
										start: tokenPosition,
										end: {
											Line: currentPosition.Line,
											Column: currentPosition.Column,
										},
									},
								),
							);
						} else {
							tokens.push(
								generateToken(
									Symbol._Identifier,
									NodeType.Identifier,
									identifier,
									{
										start: tokenPosition,
										end: {
											Line: currentPosition.Line,
											Column: currentPosition.Column,
										},
									},
								),
							);
						}
					} else if (isEOL(current)) {
						src.shift();
						currentPosition.Line++;
						currentPosition.Column = 1;
						tokenPosition.Column = 1;
					} else if (isWhitespace(current))
						src.shift() && tokenPosition.Column++;
					else
						throw new GigaScriptError(
							'LexerError',
							`Unknown character: '${current}' (${current.charCodeAt(0)})`,
							`${SOURCE_FILE}:${currentPosition.Line}:${currentPosition.Column}`,
						);
			}
		}
	}

	tokens.push(
		generateToken(Symbol.__EOF__, NodeType.__EOF__, '<!EOF>', {
			start: { Line: null, Column: null },
			end: { Line: null, Column: null },
		}),
	);

	return tokens;
}
