import { Token, TokenType } from '../types';

/**
 * Returns a token of the given type
 */
export function token(value = '', type: TokenType): Token {
    return { value, type };
}

/**
 * Returns whether the character passed is alphabetic [a-z] [A-Z]
 */
export function isAlpha(str: string): boolean {
    return str.toUpperCase() != str.toLowerCase();
}

/**
 * Returns whether the character is an integer [0-9]
 */
export function isInt(str: string): boolean {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

/**
 * Returns if the character is a skippable whitespace character [\s, \n, \t]
 */
export function isSkippable(str: string): boolean {
    return str == ' ' || str == '\n' || str == '\t' || str == ';';
}
