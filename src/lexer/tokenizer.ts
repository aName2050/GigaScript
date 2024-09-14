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

	let currPos = { Line: 1, Column: 1 };

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
				case '~':

				default:
					currPos.Column++;
					tokens.push(
						GSUtil.createToken(
							token.id,
							token.type,
							token.value,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE
						)
					);
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
							RESERVED.value,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE
						)
					);
				} else {
					tokens.push(
						GSUtil.createToken(
							TokenID.Literal._Identifier,
							Node.Literal.IDENTIFIER,
							ident,
							GSUtil.tokenPos({ ...tokenPos }, { ...currPos }),
							SOURCE_FILE
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
