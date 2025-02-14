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
	__TRUE,
	__FALSE,
	/**
	 * When no value exists for something
	 */
	__Undefined,

	/**
	 * Custom keyword defined by user
	 */
	__Identifier,

	/// Keywords
	// Generic declarations
	Declare,

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
	OpenParentheses,
	CloseParentheses,
	GreaterThan, // >
	LessThan, // <
	Comma,

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

/**
 * Keyword record
 */
let Tokens: Record<string, Token> = {};

/**
 *
 * @param id The token id/type
 * @param raw The raw value of the token
 * @returns A token object
 */
function setTokenData(id: TokenType, raw: string): Token {
	const token = {
		id,
		raw,
		_GSC: {
			Position: {
				Start: {
					Line: 0,
					Column: 0,
				},
				End: {
					Line: 0,
					Column: 0,
				},
			},
			Length: 0,
			SourceFile: '',
			Metadata: {},
		},
	} as Token;

	Tokens[raw] = token;

	return token;
}

/**
 *
 * @param raw The raw value of the token
 * @returns The token object or undefined if no token matches
 */
export function getTokenByRawValue(raw: string): Token | undefined {
	return Tokens[raw];
}

/**
 * Keyword data list
 */
const tokens: Array<{ id: TokenType; raw: string }> = [
	// Literals
	{
		id: TokenType.__TRUE,
		raw: 'true',
	},
	{
		id: TokenType.__FALSE,
		raw: 'false',
	},
	{
		id: TokenType.__Undefined,
		raw: 'undefined',
	},
	// Declarations
	{
		id: TokenType.Declare,
		raw: 'declare',
	},
	{
		id: TokenType.Constant,
		raw: 'constant',
	},
	{
		id: TokenType.Mutable,
		raw: 'mutable',
	},
	{
		id: TokenType.To,
		raw: 'to',
	},
	{
		id: TokenType.Set,
		raw: 'set',
	},
	{
		id: TokenType.A,
		raw: 'a',
	},
	{
		id: TokenType.Function,
		raw: 'function',
	},
	{
		id: TokenType.With,
		raw: 'with',
	},
	{
		id: TokenType.Parameters,
		raw: 'parameters',
	},
	{
		id: TokenType.When,
		raw: 'when',
	},
	{
		id: TokenType.Called,
		raw: 'called',
	},
	{
		id: TokenType.Do,
		raw: 'do',
	},
	{
		id: TokenType.Return,
		raw: 'return',
	},
	// Symbols
	{
		id: TokenType.Period,
		raw: '.',
	},
	{
		id: TokenType.Hashtag,
		raw: '#',
	},
	{
		id: TokenType.Exclamation,
		raw: '!',
	},
	{
		id: TokenType.Colon,
		raw: ':',
	},
	{
		id: TokenType.DoubleQuote,
		raw: '"',
	},
	{
		id: TokenType.SingleQuote,
		raw: "'",
	},
	{
		id: TokenType.OpenParentheses,
		raw: '(',
	},
	{
		id: TokenType.CloseParentheses,
		raw: ')',
	},
	{
		id: TokenType.GreaterThan,
		raw: '>',
	},
	{
		id: TokenType.LessThan,
		raw: '<',
	},
	{
		id: TokenType.Comma,
		raw: ',',
	},
	{
		id: TokenType.__Any__,
		raw: 'any',
	},
	{
		id: TokenType.__Number__,
		raw: 'number',
	},
	{
		id: TokenType.__String__,
		raw: 'string',
	},
	{
		id: TokenType.__Boolean__,
		raw: 'boolean',
	},
	{
		id: TokenType.__Object__,
		raw: 'object',
	},
	{
		id: TokenType.__Undefined__,
		raw: 'Undefined',
	},
	// Special
	{
		id: TokenType.___EOF___,
		raw: '<EOF>',
	},
];

tokens.forEach(({ id, raw }) => {
	setTokenData(id, raw);
});

export { Tokens };
