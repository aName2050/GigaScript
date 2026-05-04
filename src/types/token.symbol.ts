/**
 * GigaScript tokens
 *
 * @readonly
 */
export enum Symbol {
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
	Let,
	/** Constant variable declaration */
	Const,

	// { FUNCTIONS }
	/** Function declaration */
	Func,
	/** Return statement */
	Return,

	// // { IF/ELSE STATEMENTS }
	// /** If statement */
	// If,
	// /** Else statement */
	// Else,

	/** End Of File (EOF) */
	__EOF__,

	// { SYMBOLS }
	// Punctuation
	/** Semicolon ( ; ) */
	// Semicolon,
	// /** Colon ( : ) */
	// Colon,
	// /** Dot ( . ) */
	// Dot,
	// /** Comma ( , ) */
	// Comma,

	// Assignment Operators
	/** Equals ( = ) */
	Equals,
	// /** Plus Equals ( += ) */
	// PlusEquals,
	// /** Minus Equals ( -= ) */
	// MinusEquals,
	// /** Asterisk Equals ( *= ) */
	// AsteriskEquals,
	// /** Slash Equals ( /= ) */
	// SlashEquals,
	// /** Percent Equals ( %= ) */
	// PercentEquals,

	// /** Less Than Less Than Equals ( <<= ) */
	// LessThanLessThanEquals,
	// /** Greater Than Greater Than Equals ( >>= ) */
	// GreaterThanGreaterThanEquals,
	// /** Greater Than Greater Than Greater Than Equals ( >>>= ) */
	// GreaterThanGreaterThanGreaterThanEquals,
	// /** Ampersand Equals ( &= ) */
	// AmpersandEquals,
	// /** Bar Equals ( |= ) */
	// BarEquals,
	// /** Caret Equals ( ^= ) */
	// CaretEquals,

	// // Increment/Decrement Operators
	// /** Increment ( ++ ) */
	// PlusPlus,
	// /** Decrement ( -- ) */
	// MinusMinus,

	// // Comparison Operators
	// /** Greater Than ( > ) */
	// GreaterThan,
	// /** Less Than ( < ) */
	// LessThan,
	// /** Greater Than or Equal to ( >= ) */
	// GreaterThanEquals,
	// /** Less Than or Equal to ( <= ) */
	// LessThanEquals,
	// /** Equal to ( == ) */
	// EqualsEquals,
	// /** Not Equal to ( != ) */
	// ExclamationEquals,

	// // Logical Operators
	// /** Logical And ( && ) */
	// AmpersandAmpersand,
	// /** Logical Or ( || ) */
	// BarBar,
	// /** Logical Not ( ! ) */
	// Exclamation,

	// // Bitwise Operators
	// /** Bitwise AND ( & ) */
	// Ampersand,
	// /** Bitwise OR ( | ) */
	// Bar,
	// /** Bitwise XOR ( ^ ) */
	// Caret,
	// /** Bitwise NOT ( ~ ) */
	// Tilde,
	// /** Bitwise LEFT SHIFT ( << ) */
	// LessThanLessThan,
	// /** Bitwise SIGNED RIGHT SHIFT ( >> ) */
	// GreaterThanGreaterThan,
	// /** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
	// GreaterThanGreaterThanGreaterThan,

	// // { GROUPING }
	// /** Open Parenthesis ( ( )*/
	// OpenParen,
	// /** Closed Parenthesis ( ) ) */
	// CloseParen,
	// /** Open Brace ( { ) */
	// OpenBrace,
	// /** Close Brace ( } ) */
	// CloseBrace,
	// /** Open Bracket ( [ ) */
	// OpenBracket,
	// /** CloseBracket ( ] ) */
	// CloseBracket,
	// /** Double Quote ( " ) */
	// DoubleQuote,
	// /** Single Quote ( ' ) */
	// SingleQuote,
}
