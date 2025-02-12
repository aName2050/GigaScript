import { Token } from '../types';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export enum TokenType {
	// Literals
	/**
	 * Any characters contained within quotes " or '
	 */
	__String,
	/**
	 * Any int, float, or double
	 */
	__Number,
	/**
	 * Any true or false value
	 */
	__Boolean,
	/**
	 * When no value exists for something
	 */
	__Undefined,

	// Generic delcarations
	Delcare,

	// Variables
	Constant,
	Mutable,
	To,
	Set,

	// Functions
	A,
	Function,
	With,
	Parameters,
	When,
	Called,
	Do,
	Return,

	// Symbols
	Period,
	Hashtag,
	Exclamation,
	Colon,
	DoubleQuote,
	SingleQuote,

	// Types
	/**
	 * When any value can be used
	 */
	__Any__,
	__Number__,
	__String__,
	__Boolean__,
	__Object__,
	__Undefined__,

	// Special
	___EOF___,
}

let Tokens: Record<string, Token> = {};

export function setTokenData(id: TokenType, raw: string): Token {
	const token = {
		ID: id,
		Raw: raw,
		_GSC: {
			POS: {
				Start: {
					Line: 0,
					Column: 0,
				},
				End: {
					Line: 0,
					Column: 0,
				},
			},
		},
	} as Token;

	Tokens[raw] = token;

	return token;
}

export function getTokenByValue(raw: string): Token | undefined {
	return Tokens[raw];
}

const tokens: Array<{ id: TokenType; raw: string }> = [];

export { Tokens };
