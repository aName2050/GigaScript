import { OpPrec } from './types';
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
	// /** See https://en.wikipedia.org/wiki/This_(computer_programming) */
	// _This,

	// { IF/ELSE STATEMENTS }
	// /** If statement */
	// If,
	// /** Else statement */
	// Else,

	// { LOOPS }
	// /** While loop statement */
	// While,
	// /** For loop statement */
	// For,
	// /** Continue statement */
	// Continue,
	// /** Break statement */
	// Break,

	// { IMPORTS/EXPORTS }
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
	Throw,

	// /** Try statement */
	// Try,
	// /** Catch statement */
	// Catch,

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

	// Increment/Decrement Operators
	// /** Increment ( ++ ) */
	// PlusPlus,
	// /** Decrement ( -- ) */
	// MinusMinus,

	// Comparison Operators
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

	// Logical Operators
	// /** Logical And ( && ) */
	// AmpersandAmpersand,
	// /** Logical Or ( || ) */
	// BarBar,
	// /** Logical Not ( ! ) */
	// Exclamation,

	// Bitwise Operators
	// /** Bitwise AND ( & ) */
	// Ampersand,
	// /** Bitwise OR ( | ) */
	// Bar,
	// /** Bitwise XOR ( ^ ) */
	// Caret,
	// /** Bitwise NOT ( ~ ) */
	// Tilda,
	// /** Bitwise LEFT SHIFT ( << ) */
	// LessThanLessThan,
	// /** Bitwise SIGNED RIGHT SHIFT ( >> ) */
	// GreaterThanGreaterThan,
	// /** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
	// GreaterThanGreaterThanGreaterThan,

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

/** Represents a single token */
export interface Token {
	/** Token ID */
	id: TokenID;
	/** Token structure */
	type: Node;
	/** Raw value as seen in the source file */
	value: string;
	/** GigaScript Token Data */
	__GSC: {
		_OPC: OpPrec;
		_POS: {
			start: {
				Line: number | null;
				Column: number | null;
			};
			end: {
				Line: number | null;
				Column: number | null;
			};
		};
	};
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: TokenID,
	type: Node,
	value: string,
	OPC: OpPrec
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: {
			_OPC: OPC,
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
		},
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

export function getTokenByTypeEnum(TypeEnum: Node): Token | undefined {
	let matchedToken: Token | undefined;
	for (let i = 0; i < Object.entries(Tokens).length; i++) {
		const token: Token = Object.entries(Tokens)[i][1];
		if (token.type === TypeEnum) {
			matchedToken = token;
			break;
		} else continue;
	}

	return matchedToken;
}

// [keywords]
setTokenData(TokenID._True, Node.IDENTIFIER, 'true', OpPrec.None);
setTokenData(TokenID._False, Node.IDENTIFIER, 'false', OpPrec.None);

setTokenData(TokenID.Mut, Node.Mut, 'mut', OpPrec.None);
setTokenData(TokenID.Const, Node.Const, 'const', OpPrec.None);
setTokenData(TokenID.Function, Node.Function, 'function', OpPrec.None);
setTokenData(TokenID.Return, Node.Return, 'return', OpPrec.None);

// setTokenData(TokenID.Class, Node.Class, 'class', OpPrec.None);
// setTokenData(
// 	TokenID.Constructor,
// 	Node.Constructor,
// 	'constructor',
// 	OpPrec.None
// );
// setTokenData(TokenID.Private, Node.Private, 'private', OpPrec.None);
// setTokenData(TokenID.Public, Node.Public, 'public', OpPrec.None);
// setTokenData(TokenID.Static, Node.Static, 'static', OpPrec.None);
// setTokenData(TokenID.New, Node.New, 'new', OpPrec.None);
// setTokenData(TokenID._This, Node.Identifier, 'this', OpPrec.None);

// setTokenData(TokenID.If, Node.If, 'if', OpPrec.None);
// setTokenData(TokenID.Else, Node.Else, 'else', OpPrec.None);

// setTokenData(TokenID.While, Node.While, 'while', OpPrec.None);
// setTokenData(TokenID.For, Node.For, 'for', OpPrec.None);
// setTokenData(TokenID.Continue, Node.Continue, 'continue', OpPrec.None);
// setTokenData(TokenID.Break, Node.Break, 'break', OpPrec.None);

// setTokenData(TokenID.Import, Node.Import, 'import', OpPrec.None);
// setTokenData(TokenID.Export, Node.Export, 'export', OpPrec.None);
// setTokenData(TokenID.From, Node.From, 'from', OpPrec.None);
// setTokenData(TokenID.As, Node.As, 'as', OpPrec.Assignment);

setTokenData(TokenID.Throw, Node.ThrowError, 'throw', OpPrec.None);

// setTokenData(TokenID.Try, Node.Try, 'try', OpPrec.None);
// setTokenData(TokenID.Catch, Node.Catch, 'catch', OpPrec.None);

// [symbols]
// binary operation
setTokenData(TokenID.BinOp, Node.Plus, '+', OpPrec.Additive);
setTokenData(TokenID.BinOp, Node.Minus, '-', OpPrec.Additive);
setTokenData(TokenID.BinOp, Node.Multiply, '*', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, Node.Divide, '/', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, Node.Modulo, '%', OpPrec.Multiplicative);
// bitwise operations
// setTokenData(TokenID.Ampersand, Node.Bitwise_AND, '&', OpPrec.BITWISE_AND);
// setTokenData(TokenID.Bar, Node.Bitwise_OR, '|', OpPrec.BITWISE_OR);
// setTokenData(TokenID.Caret, Node.Bitwise_XOR, '^', OpPrec.BITWISE_XOR);
// setTokenData(TokenID.Tilda, Node.Bitwise_NOT, '~', OpPrec.None);
// setTokenData(
// 	TokenID.LessThanLessThan,
// 	Node.Bitwise_LShift,
// 	'<<',
// 	OpPrec.BITWISE_SHIFT
// );
// setTokenData(
// 	TokenID.GreaterThanGreaterThan,
// 	Node.Bitwise_SRShift,
// 	'>>',
// 	OpPrec.BITWISE_SHIFT
// );
// setTokenData(
// 	TokenID.GreaterThanGreaterThanGreaterThan,
// 	Node.Bitwise_ZFRShift,
// 	'>>>',
// 	OpPrec.BITWISE_SHIFT
// );

// punctation
setTokenData(TokenID.Semicolon, Node.Semicolon, ';', OpPrec.None);
setTokenData(TokenID.Colon, Node.Colon, ':', OpPrec.None);
setTokenData(TokenID.Dot, Node.Dot, '.', OpPrec.None);
setTokenData(TokenID.Comma, Node.Comma, ',', OpPrec.None);

// [assignments]
setTokenData(TokenID.Equals, Node.Equals, '=', OpPrec.Assignment);
// setTokenData(TokenID.PlusEquals, Node.AsgAdd, '+=', OpPrec.Assignment);
// setTokenData(TokenID.MinusEquals, Node.AsgMin, '-=', OpPrec.Assignment);
// setTokenData(TokenID.AsteriskEquals, Node.AsgMult, '*=', OpPrec.Assignment);
// setTokenData(TokenID.SlashEquals, Node.AsgDiv, '/=', OpPrec.Assignment);
// setTokenData(TokenID.PercentEquals, Node.AsgMod, '%=', OpPrec.Assignment);

// setTokenData(
// 	TokenID.AmpersandEquals,
// 	Node.Bitwise_AsgAND,
// 	'&=',
// 	OpPrec.Assignment
// );
// setTokenData(
// 	TokenID.BarEquals,
// 	Node.Bitwise_AsgOR,
// 	'|=',
// 	OpPrec.Assignment
// );
// setTokenData(
// 	TokenID.CaretEquals,
// 	Node.Bitwise_AsgXOR,
// 	'^=',
// 	OpPrec.Assignment
// );
// setTokenData(
// 	TokenID.LessThanLessThanEquals,
// 	Node.Bitwise_AsgLShift,
// 	'<<=',
// 	OpPrec.Assignment
// );
// setTokenData(
// 	TokenID.GreaterThanGreaterThanEquals,
// 	Node.Bitwise_AsgSRShift,
// 	'>>=',
// 	OpPrec.Assignment
// );
// setTokenData(
// 	TokenID.GreaterThanGreaterThanGreaterThanEquals,
// 	Node.Bitwise_AsgZFRShift,
// 	'>>>=',
// 	OpPrec.Assignment
// );

// [unary]
// setTokenData(TokenID.PlusPlus, Node.Increment, '++', OpPrec.Unary);
// setTokenData(TokenID.MinusMinus, Node.Decrement, '--', OpPrec.None);

// [comparisons]
// setTokenData(TokenID.GreaterThan, Node.GreaterThan, '>', OpPrec.None);
// setTokenData(TokenID.LessThan, Node.LessThan, '<', OpPrec.None);
// setTokenData(
// 	TokenID.GreaterThanEquals,
// 	Node.GreaterThanOrEquals,
// 	'>=',
// 	OpPrec.None
// );
// setTokenData(
// 	TokenID.LessThanEquals,
// 	Node.LessThanOrEquals,
// 	'<=',
// 	OpPrec.None
// );
// setTokenData(TokenID.EqualsEquals, Node.IsEqual, '==', OpPrec.Equality);
// setTokenData(
// 	TokenID.ExclamationEquals,
// 	Node.NotEqual,
// 	'!=',
// 	OpPrec.Equality
// );
// [logical expressions]
// setTokenData(TokenID.Exclamation, Node.Not, '!', OpPrec.Unary);
// setTokenData(TokenID.AmpersandAmpersand, Node.And, '&&', OpPrec.LOGIC_AND);
// setTokenData(TokenID.BarBar, Node.Or, '||', OpPrec.LOGIC_OR);

// [grouping]
setTokenData(TokenID.OpenParen, Node.OpenParen, '(', OpPrec.None);
setTokenData(TokenID.CloseParen, Node.CloseParen, ')', OpPrec.None);

setTokenData(TokenID.OpenBrace, Node.OpenBrace, '{', OpPrec.None);
setTokenData(TokenID.CloseBrace, Node.CloseBrace, '}', OpPrec.None);

setTokenData(TokenID.OpenBracket, Node.OpenBracket, '[', OpPrec.None);
setTokenData(TokenID.CloseBracket, Node.CloseBracket, ']', OpPrec.None);

setTokenData(TokenID.DoubleQuote, Node.DoubleQuote, '"', OpPrec.None);
setTokenData(TokenID.SingleQuote, Node.SingleQuote, "'", OpPrec.None);

// [special]
setTokenData(TokenID.__EOF__, Node.__EOF__, '<EOF>', OpPrec.None);

export { Tokens };
