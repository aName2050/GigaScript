import { Token, TokenPos } from '../types';
import { Tokens, TokenType } from './tokens';

/**
 *
 * @param id The id/type of a token
 * @param raw The raw value of the token
 * @param pos The position of the token within the file
 * @returns A token object
 */
export function createToken(id: TokenType, raw: string, pos: TokenPos): Token {
	return {
		id,
		raw,
		_GSC: {
			POS: pos,
		},
	} as Token;
}

export function tokenPosition(
	Start: { Line: number; Column: number },
	End: { Line: number; Column: number }
): TokenPos {
	return {
		Start,
		End,
	};
}

/**
 *
 * @param str The string to test
 * @returns If the string is alphabetic
 */
export function isAlpha(str: string): boolean {
	return /^[A-Za-z_]/.test(str);
}

/**
 *
 * @param str The string to test
 * @returns If the string is alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
	return /^[A-Za-z0-9_]/.test(str);
}

/**
 *
 * @param str The string to test
 * @returns If the string is numeric
 */
export function isNumeric(str: string): boolean {
	const char: number = str.charCodeAt(0);
	const bounds: number[] = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

	return char >= bounds[0] && char <= bounds[1];
}

/**
 *
 * @param str The string to test
 * @returns If the string is a whitespace character
 */
export function isWhitespace(str: string): boolean {
	return [' ', '\t'].includes(str);
}

/**
 *
 * @param str The string to test
 * @returns If the string indicates a new line
 */
export function isEOL(str: string): boolean {
	return /\r?\n/.test(str);
}

/**
 *
 * @param str The string to test
 * @returns If the string contains an allowed escape character
 */
export function isAllowedEscapeCharacter(str: string): boolean {
	const validCharecters: string[] = ['b', 't', 'n', 'f', 'r', '"', "'"];
	return validCharecters.includes(str);
}

/**
 *
 * @param str The string to handle
 * @returns The modified string with character escape sequences
 */
export function handleEscapeSequence(str: string): string {
	const escapeCharacters: Record<string, string> = {
		'b': '\b',
		't': '\t',
		'n': '\n',
		'f': '\f',
		'r': '\r',
		'"': '"',
		"'": "'",
	};

	return escapeCharacters[str] || str;
}
