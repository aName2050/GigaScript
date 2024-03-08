export enum TokenType {
	// [Literal Types]
	/** Any number between 0 and 9 */
	Number,
	/** Any combination of characters and numbers (certain characters need to be escaped) */
	String,

	/** True value */
	True,
	/** False value */
	False,

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

	/** Try statement */
	Try,
	/** Catch statement */
	Catch,

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
	/** Multiply ( * )*/
	Multiply,
	/** Diivde ( / ) */
	Divide,
	/** Modulo */
	Modulo,

	// Assignment Operators
	/** Equals ( = ) */
	Equals,
	/** Plus Equals ( += ) */
	PlusEquals,
	/** Minus Equals ( -= ) */
	MinusEquals,
	/** Multiply Equals ( *= ) */
	MultiplyEquals,
	/** Divide Equals ( /= ) */
	DivideEquals,
	/** Modulo Equals ( %= ) */
	ModuloEquals,

	// Increment/Decrement Operators
	/** Increment ( ++ ) */
	Increment,
	/** Decrement ( -- ) */
	Decrement,

	// Comparison Operators
	/** Greater Than ( > ) */
	GreaterThan,
	/** Less Than ( < ) */
	LessThan,
	/** Greater Than or Equal to ( >= ) */
	GreaterThanOrEquals,
	/** Less Than or Equal to ( <= ) */
	LessThanOrEquals,
	/** Equal to ( == ) */
	IsEqual,
	/** Not Equal to ( != ) */
	NotEqual,
	/** And ( && ) */
	And,
	/** Or ( || ) */
	Or,

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
	SingleQuote,
}
