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
export enum Tokens {
	// [Literal Types]
	/** 0 - 9 */
	_Number,
	/** abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 ~!@#$%^&*()_+`-=[]\{}|;':",./<>? */
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

	/** Binary Operator (+ - * / %) */
	BinOp,

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
	/** Plus Equals ( += ) */
	PlusEquals,
	/** Plus Equals ( -= ) */
	MinusEquals,
	/** Plus Equals ( *= ) */
	AsterikEquals,
	/** Plus Equals ( /= ) */
	// PlusEquals,
	/** Plus Equals ( %= ) */
	// PlusEquals,

	//
}
