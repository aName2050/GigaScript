/**
 * tokens.ts
 *
 * All available tokens in GigaScript
 */

import { OpPrec } from './lexer/types';
import { NodeType } from './nodes';

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
	type: NodeType;
	/** Raw value as seen in the source file */
	value: string;
	/** GigaScript Token Data */
	__GSC: {
		_OPC: OpPrec;
		_POS: {
			Line: number;
			Column: number;
		};
	};
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: TokenID,
	type: NodeType,
	value: string,
	OPC: OpPrec
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: { _OPC: OPC, _POS: { Line: 0, Column: 0 } },
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token {
	return Tokens[value];
}

// [keywords]
setTokenData(TokenID._True, NodeType.Identifier, 'true', OpPrec.None);
setTokenData(TokenID._False, NodeType.Identifier, 'false', OpPrec.None);

setTokenData(TokenID.Let, NodeType.Let, 'let', OpPrec.None);
setTokenData(TokenID.Const, NodeType.Const, 'const', OpPrec.None);
setTokenData(TokenID.Func, NodeType.Func, 'func', OpPrec.None);
setTokenData(TokenID.Return, NodeType.Return, 'return', OpPrec.None);
setTokenData(TokenID.Class, NodeType.Class, 'class', OpPrec.None);
setTokenData(TokenID.Private, NodeType.Private, 'private', OpPrec.None);
setTokenData(TokenID.Public, NodeType.Public, 'public', OpPrec.None);
setTokenData(TokenID.New, NodeType.New, 'new', OpPrec.None);
setTokenData(
	TokenID.Constructor,
	NodeType.Constructor,
	'constructor',
	OpPrec.None
);
setTokenData(TokenID.If, NodeType.If, 'if', OpPrec.None);
setTokenData(TokenID.Else, NodeType.Else, 'else', OpPrec.None);
setTokenData(TokenID.While, NodeType.While, 'while', OpPrec.None);
setTokenData(TokenID.For, NodeType.For, 'for', OpPrec.None);
setTokenData(TokenID.Continue, NodeType.Continue, 'continue', OpPrec.None);
setTokenData(TokenID.Break, NodeType.Break, 'break', OpPrec.None);
setTokenData(TokenID.Import, NodeType.Import, 'import', OpPrec.None);
setTokenData(TokenID.Export, NodeType.Export, 'export', OpPrec.None);
setTokenData(TokenID.From, NodeType.From, 'from', OpPrec.None);
setTokenData(TokenID.Throw, NodeType.Throw, 'throw', OpPrec.None);
setTokenData(TokenID.Try, NodeType.Try, 'try', OpPrec.None);
setTokenData(TokenID.Catch, NodeType.Catch, 'catch', OpPrec.None);

// [symbols]
// binary operation
setTokenData(TokenID.BinOp, NodeType.Plus, '+', OpPrec.Additive);
setTokenData(TokenID.BinOp, NodeType.Minus, '-', OpPrec.Additive);
setTokenData(TokenID.BinOp, NodeType.Multiply, '*', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, NodeType.Divide, '/', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, NodeType.Modulo, 'let', OpPrec.Multiplicative);
// bitwise operations
// TODO: implement bitwise operations
// punctation
setTokenData(TokenID.Semicolon, NodeType.Semicolon, ';', OpPrec.None);
setTokenData(TokenID.Colon, NodeType.Colon, ':', OpPrec.None);
setTokenData(TokenID.Dot, NodeType.Dot, '.', OpPrec.None);
setTokenData(TokenID.Comma, NodeType.Comma, ',', OpPrec.None);
setTokenData(TokenID.Ampersand, NodeType.Ampersand, '&', OpPrec.None);
setTokenData(TokenID.Bar, NodeType.Bar, '|', OpPrec.None);

// [assignments]
setTokenData(TokenID.Equals, NodeType.Equals, '=', OpPrec.Assignment);
setTokenData(TokenID.PlusEquals, NodeType.AsgAdd, '+=', OpPrec.Assignment);
setTokenData(TokenID.MinusEquals, NodeType.AsgMin, '-=', OpPrec.Assignment);
setTokenData(TokenID.AsteriskEquals, NodeType.AsgMult, '*=', OpPrec.Assignment);
setTokenData(TokenID.SlashEquals, NodeType.AsgDiv, '/=', OpPrec.Assignment);
setTokenData(TokenID.PercentEquals, NodeType.AsgMod, '%=', OpPrec.Assignment);

// [unary]
setTokenData(TokenID.PlusPlus, NodeType.Increment, '++', OpPrec.Unary);
setTokenData(TokenID.MinusMinus, NodeType.Decrement, '--', OpPrec.None);

// [comparisons]
setTokenData(TokenID.GreaterThan, NodeType.GreaterThan, '>', OpPrec.None);
setTokenData(TokenID.LessThan, NodeType.LessThan, '<', OpPrec.None);
setTokenData(
	TokenID.GreaterThanEquals,
	NodeType.GreaterThanOrEquals,
	'>=',
	OpPrec.None
);
setTokenData(
	TokenID.LessThanEquals,
	NodeType.LessThanOrEquals,
	'<=',
	OpPrec.None
);
setTokenData(TokenID.EqualsEquals, NodeType.IsEqual, '==', OpPrec.Equality);
setTokenData(
	TokenID.ExclamationEquals,
	NodeType.NotEqual,
	'!=',
	OpPrec.Equality
);
// [logical expressions]
setTokenData(TokenID.Exclamation, NodeType.Not, '!', OpPrec.None);
setTokenData(TokenID.AmpersandAmpersand, NodeType.And, '&&', OpPrec.LOGIC_AND);
setTokenData(TokenID.BarBar, NodeType.Or, '||', OpPrec.LOGIC_OR);

// [grouping]
setTokenData(TokenID.OpenParen, NodeType.OpenParen, '(', OpPrec.None);
setTokenData(TokenID.CloseParen, NodeType.CloseParen, ')', OpPrec.None);

setTokenData(TokenID.OpenBrace, NodeType.OpenBrace, '{', OpPrec.None);
setTokenData(TokenID.CloseBrace, NodeType.CloseBrace, '}', OpPrec.None);

setTokenData(TokenID.OpenBracket, NodeType.OpenBracket, '[', OpPrec.None);
setTokenData(TokenID.CloseBracket, NodeType.CloseBracket, ']', OpPrec.None);

setTokenData(TokenID.DoubleQuote, NodeType.DoubleQuote, '"', OpPrec.None);
setTokenData(TokenID.SingleQuote, NodeType.SingleQuote, "'", OpPrec.None);

// [special]
setTokenData(TokenID.__EOF__, NodeType.__EOF__, '<EOF>', OpPrec.None);

export { Tokens };
