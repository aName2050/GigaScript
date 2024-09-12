import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export enum TokenID {
	// [Literal Types]
	/** Any number between 0 and 9 */
	_Number,
	/** Any combination of characters and numbers (certain characters need to be escaped) */
	_String,

	/** True value */
	_True,
	/** False value */
	_False,

	/** Undefined value */
	_Undefined,

	/** Null value */
	_Null,

	/** User defined symbol */
	_Identifier,

	// [Keywords]
	// { VARIABLES }
	/** Mutable variable declaration */
	Mut,
	/** Constant variable declaration */
	Const,

	// { FUNCTIONS }
	/** Function declaration */
	Function,
	/** Return statement */
	Return,

	// { CLASSES }
	/** Class declaration */
	Class,
	/** Class constructor */
	Constructor,
	/** Private method/property */
	Private,
	/** Public method/property */
	Public,
	/** Static method/property */
	Static,
	/** New Class */
	New,
	/** See https://en.wikipedia.org/wiki/This_(computer_programming) */
	_This,

	// { IF/ELSE STATEMENTS }
	/** If statement */
	If,
	/** Else statement */
	Else,

	// { LOOPS }
	/** While loop statement */
	While,
	/** For loop statement */
	For,
	/** Continue statement */
	Continue,
	/** Break statement */
	Break,

	// { IMPORTS/EXPORTS }
	/** Import statement */
	Import,
	/** Export statement */
	Export,
	/** From statement */
	From,
	/** As statement */
	As,

	// { SPECIAL }
	/** Throw exception statement */
	Throw,

	/** Try statement */
	Try,
	/** Catch statement */
	Catch,

	/** Binary Operation (+ - * / %) */
	BinOp,

	// /** Bitwise Operation ( >> << & | ~ ^ ) */
	// BitOp,

	// { SYMBOLS }
	// Punctation
	/** Semicolon ( ; ) */
	Semicolon,
	/** Colon ( : ) */
	Colon,
	/** Dot ( . ) */
	Dot,
	/** Comma ( , ) */
	Comma,

	// Assignment Operators
	/** Equals ( = ) */
	Equals,
	// /** Plus Equals ( += ) */
	PlusEquals,
	/** Minus Equals ( -= ) */
	MinusEquals,
	/** Asterisk Equals ( *= ) */
	AsteriskEquals,
	/** Slash Equals ( /= ) */
	SlashEquals,
	/** Percent Equals ( %= ) */
	PercentEquals,

	// /** Less Than Less Than Equals ( <<= ) */
	LessThanLessThanEquals,
	/** Greater Than Greater Than Equals ( >>= ) */
	GreaterThanGreaterThanEquals,
	/** Greater Than Greater Than Greater Than Equals ( >>>= ) */
	GreaterThanGreaterThanGreaterThanEquals,
	/** Ampersand Equals ( &= ) */
	AmpersandEquals,
	/** Bar Equals ( |= ) */
	BarEquals,
	/** Caret Equals ( ^= ) */
	CaretEquals,

	// Increment/Decrement Operators
	/** Increment ( ++ ) */
	PlusPlus,
	/** Decrement ( -- ) */
	MinusMinus,

	// Comparison Operators
	/** Greater Than ( > ) */
	GreaterThan,
	/** Less Than ( < ) */
	LessThan,
	/** Greater Than or Equal to ( >= ) */
	GreaterThanEquals,
	/** Less Than or Equal to ( <= ) */
	LessThanEquals,
	/** Equal to ( == ) */
	EqualsEquals,
	/** Not Equal to ( != ) */
	ExclamationEquals,

	// Logical Operators
	/** Logical And ( && ) */
	AmpersandAmpersand,
	/** Logical Or ( || ) */
	BarBar,
	/** Logical Not ( ! ) */
	Exclamation,

	// Bitwise Operators
	/** Bitwise AND ( & ) */
	Ampersand,
	/** Bitwise OR ( | ) */
	Bar,
	/** Bitwise XOR ( ^ ) */
	Caret,
	/** Bitwise NOT ( ~ ) */
	Tilda,
	/** Bitwise LEFT SHIFT ( << ) */
	LessThanLessThan,
	/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
	GreaterThanGreaterThan,
	/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
	GreaterThanGreaterThanGreaterThan,

	// { GROUPING }
	/** Open Parenthesis ( ( )*/
	OpenParen,
	/** Closed Parenthesis ( ) ) */
	CloseParen,
	/** Open Brace ( { ) */
	OpenBrace,
	/** Close Brace ( } ) */
	CloseBrace,
	/** Open Bracket ( [ ) */
	OpenBracket,
	/** CloseBracket ( ] ) */
	CloseBracket,
	/** Double Quote ( " ) */
	DoubleQuote,
	/** Single Quote ( ' ) */
	SingleQuote,

	/** End Of File (EOF) */
	__EOF__,
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: Token['id'],
	type: Token['type'],
	value: string
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: {
			_POS: {
				start: {
					Line: null,
					Column: null,
				},
				end: {
					Line: null,
					Column: null,
				},
			},
			_LENGTH: null,
		},
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

export { Tokens };
