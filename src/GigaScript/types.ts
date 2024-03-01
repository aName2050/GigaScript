// [ LEXER ]

import { ClassMethod, ClassProperty } from './ast/ast';

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
	Return, // Returns a value

	Class, // Class declaration
	Private, // Private Class property/method
	Public, // Public Class property/method
	New, // New Class Object initializer

	If, // If statement
	Else, // If statement alternate path

	While, // While loop statement
	For, // For loop statement
	Continue, // For Loop/While Loop continue statement
	Break, // For Loop/While Loop break statement

	Import, // Import GigaScript code from another file
	Export, // Export GigaScript code to another file (the file returns the last Export statements value)
	From, // From sets the imported value to a symbol

	Throw, // Throws an exception

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

export interface Class {
	properties: ClassProperty[];
	methods: ClassMethod[];
}
