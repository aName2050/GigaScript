// [ LEXER ]

// Contains the tokens that are parser understands
export enum TokenType {
	// Literal Types (USER_DEFINED)
	Number, // 0-9
	String, // " anything "

	Identifier, // Variable names, function names, etc.

	// Keywords
	Let, // Mutable variable declaration
	Const, // Constant variable declaration

	Func, // Function declaration

	If, // If statement
	Else, // If statement alternate path

	For, // For loop statement
	// Continue, // For Loop continue statement
	// Break, // For loop break statement

	Import, // Import GigaScript code from another file

	// Comparison Operators
	GreaterThan, // >
	LessThan, // <
	IsEqual, // ==
	NotEquals, // !=
	Exclamation, // !
	And, // &&
	Or, // ||

	// Symbols
	Bar, // |
	Ampersand, // &

	// Punctuation
	Comma, // ,
	Dot, // .
	Colon, // :

	Semicolon, // ;

	// Mathematical Operations
	BinOp, // Binary operator (+ - * / %)

	// Assignment Operators
	Equals, // =

	// Grouping
	OpenParen, // (
	CloseParen, // )

	OpenBrace, // {
	CloseBrace, // }

	OpenBracket, // [
	CloseBracket, // ]

	DoubleQuote, // "

	// Special
	EOF, // End Of File
}

// Represents a single token in the language
export interface Token {
	value: string; // the raw value as seen in the language
	type: TokenType; // token structure
}
