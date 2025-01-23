import { Node } from '../parser/nodes';
import { Token } from '../../typescript/GS.types';

/**
 * Creates a new `Token` object.
 *
 * @param id The ID of the token.
 * @param type The type of the token.
 * @param value The raw value of the token.
 * @param position The position of the token in the source code.
 * @param srcFile The source file the token was found in.
 * @param metadata Extra metadata of the token.
 * @returns A new `Token` object.
 */
export function createToken(
	id: Token['id'],
	type: Token['type'],
	nodeGroup: Token['nodeGroup'],
	value: string,
	position: Token['__GSC']['_POS'],
	srcFile?: string,
	metadata?: Token['__GSC']['_METADATA']
): Token {
	return {
		id,
		type,
		nodeGroup,
		value,
		__GSC: {
			_POS: position,
			_LENGTH: value.length,
			_SRC_FILE: srcFile,
			_METADATA: metadata,
		},
	} as Token;
}

/**
 * Creates a new `TokenPosition` object.
 *
 * @param start The start position of the token.
 * @param end The end position of the token.
 * @returns A new `TokenPosition` object.
 */
export function tokenPos(
	start: { Line: number; Column: number },
	end: { Line: number; Column: number }
): Token['__GSC']['_POS'] {
	return {
		start,
		end,
	};
}

/**
 * Checks if a given string is alphabetic.
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
 * Checks if a given string is numeric (0-9).
 *
 * @param str The string to test
 * @returns If the string is numeric
 */
export function isNumeric(str: string): boolean {
	const char = str.charCodeAt(0);
	const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

	return char >= bounds[0] && char <= bounds[1];
}

/**
 * Checks if a given string is a whitespace character.
 *
 * @param str The string to test
 * @returns If the string is a whitespace character
 */
export function isWhitespace(str: string): boolean {
	return str == ' ' || str == '\t';
}

/**
 * Checks if the end of the line has been reached.
 *
 * @param str The string to test
 * @returns If the string is a newline character
 */
export function isEOL(str: string): boolean {
	return /\r?\n/.test(str);
}

/**
 * Checks if a given string is a supported escape character.
 *
 * @param str The string to test
 * @returns If the string is a supported escape character
 */
export function isSupportedEscapeCharacter(str: string): boolean {
	const validCharecters = ['b', 't', 'n', 'f', 'r', '"', "'"];
	return validCharecters.includes(str);
}

/**
 * Handles escape sequences in strings.
 * @param str The string to handle escape sequences in.
 * @returns The string with handled escape sequences.
 */
export function handleEscapeSequence(str: string): string {
	const escChars: Record<string, string> = {
		'b': '\b',
		't': '\t',
		'n': '\n',
		'f': '\f',
		'r': '\r',
		'"': '"',
		"'": "'",
	};

	return escChars[str] || str;
}
