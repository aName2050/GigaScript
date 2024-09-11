/**
 * GigaScript Nodes
 *
 * @readonly
 */
export enum Node {
	// [Literal Types]
	/** Any number between 0 and 9 */
	NUMBER,
	/** Any combination of characters and numbers (certain characters need to be escaped) */
	STRING,

	/** User defined symbol */
	IDENTIFIER,

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
	// TODO:
	// /** Class declaration */
	// Class,
	// /** Class constructor */
	// Constructor,
	// /** Private method/property */
	// Private,
	// /** Public method/property */
	// Public,
	// /** Static method/property */
	// Static,
	// /** New Class */
	// New,

	// { IF/ELSE STATEMENTS }
	// TODO:
	// /** If statement */
	// If,
	// /** Else statement */
	// Else,

	// { LOOPS }
	// TODO:
	// /** While loop statement */
	// While,
	// /** For loop statement */
	// For,
	// /** Continue statement */
	// Continue,
	// /** Break statement */
	// Break,

	// { IMPORTS/EXPORTS }
	// TODO:
	// /** Import statement */
	// Import,
	// /** Export statement */
	// Export,
	// /** From statement */
	// From,
	// /** As statement */
	// As,

	// { SPECIAL }
	/** Throw exception statement */
	ThrowError,

	// TODO:
	// /** Try statement */
	// Try,
	// /** Catch statement */
	// Catch,

	/** Binary Operation (+ - * / %) */
	BinOp,

	// TODO:
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

	// Binary Operators
	/** Plus ( + ) */
	Plus,
	/** Minus ( - ) */
	Minus,
	/** Multiply ( * )*/
	Multiply,
	/** Diivde ( / ) */
	Divide,
	/** Modulo ( % ) */
	Modulo,

	// Assignment Operators
	/** Equals ( = ) */
	Equals,
	// TODO:
	// /** Plus Equals ( += ) */
	// AsgAdd,
	// /** Minus Equals ( -= ) */
	// AsgMin,
	// /** Multiply Equals ( *= ) */
	// AsgMult,
	// /** Divide Equals ( /= ) */
	// AsgDiv,
	// /** Modulo Equals ( %= ) */
	// AsgMod,

	// /** Bitwise LShift Equals ( <<= ) */
	// Bitwise_AsgLShift,
	// /** Bitwise Signed RShift Equals Equals ( >>= ) */
	// Bitwise_AsgSRShift,
	// /** Bitwise Zero-Fill RShift Equals ( >>>= ) */
	// Bitwise_AsgZFRShift,
	// /** Bitwise AND Equals ( &= ) */
	// Bitwise_AsgAND,
	// /** Bitwise OR Equals ( |= ) */
	// Bitwise_AsgOR,
	// /** Bitwise XOR Equals ( ^= ) */
	// Bitwise_AsgXOR,

	// Increment/Decrement Operators
	// TODO:
	// /** Increment ( ++ ) */
	// Increment,
	// /** Decrement ( -- ) */
	// Decrement,

	// Comparison Operators
	// TODO:
	// /** Greater Than ( > ) */
	// GreaterThan,
	// /** Less Than ( < ) */
	// LessThan,
	// /** Greater Than or Equal to ( >= ) */
	// GreaterThanOrEquals,
	// /** Less Than or Equal to ( <= ) */
	// LessThanOrEquals,
	// /** Equal to ( == ) */
	// IsEqual,
	// /** Not Equal to ( != ) */
	// NotEqual,

	// Logical Expressions
	// TODO:
	// /** Exclamation ( ! ) */
	// Not,
	// /** And ( && ) */
	// And,
	// /** Or ( || ) */
	// Or,

	// Bitwise Operators
	// TODO:
	// /** Bitwise AND ( & ) */
	// Bitwise_AND,
	// /** Bitwise OR ( | ) */
	// Bitwise_OR,
	// /** Bitwise XOR ( ^ ) */
	// Bitwise_XOR,
	// /** Bitwise NOT ( ~ ) */
	// Bitwise_NOT,
	// /** Bitwise LEFT SHIFT ( << ) */
	// Bitwise_LShift,
	// /** Bitwise SIGNED RIGHT SHIFT ( >> ) */
	// Bitwise_SRShift,
	// /** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
	// Bitwise_ZFRShift,

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
