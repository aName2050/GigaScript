/**
 * tokens.ts
 *
 * All available tokens in GigaScript
 */

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

	/** User defined symbol */
	Identifier,

	// [Keywords]
	// { VARIABLES }
	/** Mutable variable declaration */
	Let,
	/** Constant variable declaration */
	Const,

	// { FUNCTIONS }
	/** Function declaration */
	Func,
	/** Return statement */
	Return,

	// { CLASSES }
	/** Class declaration */
	Class,
	/** Private method/property */
	Private,
	/** Public method/property */
	Public,
	/** New Class */
	New,
	/** Class constructor */
	Constructor,

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

	// { SPECIAL }
	/** Throw exception statement */
	Throw,

	/** Binary Operation (+ - * / %) */
	BinOp,

	/** Bitwise Operation ( >> << & | ~ ^ ) */
	BitOp,

	/** End Of File (EOF) */
	__EOF__,

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
	/** Exclamation ( ! ) */
	Exclamation,
	/** Ampersand ( & ) */
	Ampersand,
	/** Bar */
	Bar,

	// Binary Operators
	/** Plus ( + ) */
	Plus,
	/** Minus ( - ) */
	Minus,
	/** Asterisk ( * )*/
	Asterisk,
	/** Slash ( / ) */
	Slash,
	/** Percent */
	Percent,

	// Assignment Operators
	/** Equals ( = ) */
	Equals,
	/** Plus Equals ( += ) */
	PlusEquals,
	/** Minus Equals ( -= ) */
	MinusEquals,
	/** Asterisk Equals ( *= ) */
	AsteriskEquals,
	/** Slash Equals ( /= ) */
	SlashEquals,
	/** Percent Equals ( %= ) */
	PercentEquals,

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
	/** And ( && ) */
	AmpersandAmpersand,
	/** Or ( || ) */
	BarBar,

	// Bitwise Operators
	// TODO:

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
}

export enum TokenType {}

/** Represents a single token */
export interface Token {
	/** Token ID */
	id: TokenID;
	/** Token structure */
	type: TokenType;
	/** Raw value as seen in the source file */
	value: string;
}
