import { NodeType } from '../nodes';
import { Token, TokenID, getTokenByValue } from '../tokens';
import { OpPrec } from './types';

/**
 *
 * @param id The ID of the token
 * @param type The type of the token
 * @param value The raw value of the token
 * @param Line Line number the first character of the token was found on
 * @param Column Column number the first character of the token was found on
 * @returns A new token
 */
export function createToken(
	id: TokenID,
	type: NodeType,
	value: string,
	PositionData: {
		start: {
			line: number;
			column: number;
		};
		end: {
			line: number;
			column: number;
		};
	},
	OPC?: OpPrec
): Token {
	return {
		id,
		type,
		value,
		__GSC: {
			_OPC: getTokenByValue(value)?.__GSC._OPC || OPC,
			_POS: {
				start: {
					Line: PositionData.start.line,
					Column: PositionData.start.column,
				},
				end: {
					Line: PositionData.end.line,
					Column: PositionData.end.column,
				},
			},
		},
	} as Token;
}

/**
 *
 * @param str The string to test
 * @param allowAlphanumeric Whether to allow alphanumeric strings
 * @returns If the string is alphabetic or is alphanumeric
 */
export function isAlpha(str: string, allowAlphanumeric = false): boolean {
	if (allowAlphanumeric) return /^[A-Za-z0-9_]/.test(str);
	return /^[A-Za-z_]/.test(str);
}

/**
 *
 * @param str The string to test
 * @returns Returns whether the string is an integer between 0 and 9
 */
export function isInt(str: string): boolean {
	const c = str.charCodeAt(0);
	const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

	return c >= bounds[0] && c <= bounds[1];
}

/**
 *
 * @param str The string to test
 * @returns Whether the string is a whitespace character
 */
export function isWhitespace(str: string): boolean {
	// prettier-ignore
	return str == ' ' || str == '\t' || str == '\r';
}

/**
 *
 * @param str The string to test
 * @returns Whether the string is a new line character
 */
export function isEOL(str: string): boolean {
	return str == '\n';
}

/**
 *
 * @param str The string to test
 * @returns Whether the string is a valid escape character
 */
export function isValidEscapeChar(str: string): boolean {
	const validChars = ['n', 't', '\\', '"', "'"];
	return validChars.includes(str);
}

/**
 *
 * @param escSeq The raw escape sequence to handle
 * @returns The string literal with properly handled escape sequences
 */
export function handleEscSeq(str: string): string {
	const escChars: Record<string, string> = {
		'\\n': '\n',
		'\\t': '\t',
		'\\\\': '\\',
		'\\"': '"',
		"\\'": "'",
	};

	let output: string[] = [];
	let i = 0;

	while (i < str.length) {
		if (str[i] === '\\') {
			const escSeq = str.slice(i, i + 2);

			if (escChars[escSeq]) {
				output.push(escChars[escSeq]);
				i += 2;
			} else {
				output.push(str[i]);
				i += 1;
			}
		} else {
			output.push(str[i]);
			i += 1;
		}
	}

	return output.join('');
}
