/**
 * tokens.ts
 *
 * All available tokens in GigaScript
 */

import { OpPrec } from './lexer/types';
import { TokenType } from './nodes';

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
	SingleQuote,
}

/** Represents a single token */
export interface Token {
	/** Token ID */
	id: TokenID;
	/** Token structure */
	type: TokenType;
	/** Raw value as seen in the source file */
	value: string;
	/** GigaScript Token Data */
	__GSC: {
		OPC: OpPrec;
		_START: number;
		_END: number;
	};
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: TokenID,
	type: TokenType,
	value: string,
	OPC: OpPrec
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: { OPC, _START: 0, _END: 0 },
	} as Token;

	Tokens[value] = token;

	return token;
}

// [keywords]
setTokenData(TokenID._True, TokenType.Identifier, 'true', OpPrec.None);
setTokenData(TokenID._False, TokenType.Identifier, 'false', OpPrec.None);

setTokenData(TokenID.Let, TokenType.Let, 'let', OpPrec.None);
setTokenData(TokenID.Const, TokenType.Const, 'const', OpPrec.None);
setTokenData(TokenID.Func, TokenType.Func, 'func', OpPrec.None);
setTokenData(TokenID.Return, TokenType.Return, 'return', OpPrec.None);
setTokenData(TokenID.Class, TokenType.Class, 'class', OpPrec.None);
setTokenData(TokenID.Private, TokenType.Private, 'private', OpPrec.None);
setTokenData(TokenID.Public, TokenType.Public, 'public', OpPrec.None);
setTokenData(TokenID.New, TokenType.New, 'new', OpPrec.None);
setTokenData(
	TokenID.Constructor,
	TokenType.Constructor,
	'constructor',
	OpPrec.None
);
setTokenData(TokenID.If, TokenType.If, 'if', OpPrec.None);
setTokenData(TokenID.Else, TokenType.Else, 'else', OpPrec.None);
setTokenData(TokenID.While, TokenType.While, 'while', OpPrec.None);
setTokenData(TokenID.For, TokenType.For, 'for', OpPrec.None);
setTokenData(TokenID.Continue, TokenType.Continue, 'continue', OpPrec.None);
setTokenData(TokenID.Break, TokenType.Break, 'break', OpPrec.None);
setTokenData(TokenID.Import, TokenType.Import, 'import', OpPrec.None);
setTokenData(TokenID.Export, TokenType.Export, 'export', OpPrec.None);
setTokenData(TokenID.From, TokenType.From, 'from', OpPrec.None);
setTokenData(TokenID.Throw, TokenType.Throw, 'throw', OpPrec.None);
setTokenData(TokenID.Try, TokenType.Try, 'try', OpPrec.None);
setTokenData(TokenID.Catch, TokenType.Catch, 'catch', OpPrec.None);

// [symbols]
// binary operation
setTokenData(TokenID.BinOp, TokenType.Plus, '+', OpPrec.Additive);
setTokenData(TokenID.BinOp, TokenType.Minus, '-', OpPrec.Additive);
setTokenData(TokenID.BinOp, TokenType.Multiply, '*', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, TokenType.Divide, '/', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, TokenType.Modulo, 'let', OpPrec.Multiplicative);
// bitwise operations
// TODO: implement bitwise operations
// punctation
setTokenData(TokenID.Semicolon, TokenType.Semicolon, ';', OpPrec.None);
setTokenData(TokenID.Colon, TokenType.Colon, ':', OpPrec.None);
setTokenData(TokenID.Dot, TokenType.Dot, '.', OpPrec.None);
setTokenData(TokenID.Comma, TokenType.Comma, ',', OpPrec.None);
setTokenData(TokenID.Exclamation, TokenType.Exclamation, '!', OpPrec.None);
setTokenData(TokenID.Ampersand, TokenType.Ampersand, '&', OpPrec.None);
setTokenData(TokenID.Bar, TokenType.Bar, '|', OpPrec.None);

// [assignments]
setTokenData(TokenID.Equals, TokenType.Equals, '=', OpPrec.Assignment);
setTokenData(TokenID.PlusEquals, TokenType.AsgAdd, '+=', OpPrec.Assignment);
setTokenData(TokenID.MinusEquals, TokenType.AsgMin, '-=', OpPrec.Assignment);
setTokenData(
	TokenID.AsteriskEquals,
	TokenType.AsgMult,
	'*=',
	OpPrec.Assignment
);
setTokenData(TokenID.SlashEquals, TokenType.AsgDiv, '/=', OpPrec.Assignment);
setTokenData(TokenID.PercentEquals, TokenType.AsgMod, '%=', OpPrec.Assignment);

// [unary]
setTokenData(TokenID.PlusPlus, TokenType.Increment, '++', OpPrec.Unary);
setTokenData(TokenID.MinusMinus, TokenType.Decrement, '--', OpPrec.None);

// [comparisons]
setTokenData(TokenID.GreaterThan, TokenType.GreaterThan, '>', OpPrec.None);
setTokenData(TokenID.LessThan, TokenType.LessThan, '<', OpPrec.None);
// setTokenData(
// 	TokenID.GreaterThanEquals,
// 	TokenType.GreaterThanOrEquals,
// 	'<=',
// 	OpPrec.None
// );

export { Tokens };
