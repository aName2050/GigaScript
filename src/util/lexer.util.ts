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
