import { NodeType, Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export namespace TokenID {
	export enum Literal {
		/** Any number between 0 and 9 */
		_Number = 0,
		/** Any combination of characters and numbers */
		_String = 1,

		/** True value */
		_True = 2,
		/** False value */
		_False = 3,

		/** Undefined value */
		_Undefined = 4,

		/** Null value */
		_Null = 5,

		/** User defined symbol */
		_Identifier = 6,
	}

	export enum Keyword {
		/** Mutable variable declaration */
		Var = 7,
		/** Constant variable declaration */
		Const = 8,

		/** Function declaration */
		Function = 9,
		/** Return statement */
		Return = 10,

		/** Class declaration */
		Class = 11,
		/** Class constructor method */
		Constructor = 12,
		/** Private method/property */
		Private = 13,
		/** Public method/property */
		Public = 14,
		/** Static method/property */
		Static = 15,
		/** New class */
		New = 16,
		/** See https://en.wikipedia.org/wiki/This_(computer_programming) */
		_This = 17,

		/** If statement */
		If = 18,
		/** Else statement */
		Else = 19,

		/** Switch statement */
		Switch = 20,
		/** Case statement */
		Case = 21,
		/** Default statement */
		Default = 22,

		/** While loop statement */
		While = 23,
		/** For loop statement */
		For = 24,
		/** Continue loop statement */
		Continue = 25,
		/** Break loop statement */
		Break = 26,

		/** Import external file statement */
		Import = 27,
		/** Export value statement */
		Export = 28,
		/** From file statement */
		From = 29,
		/** As statement */
		As = 30,

		/** Throw an exception */
		ThrowError = 31,

		/** Try statement */
		Try = 32,
		/** Catch statement */
		Catch = 33,
	}

	export enum Operation {
		/** Binary operation ( + - * / % ) */
		BinOp = 34,

		/** Bitwise Operation ( >> << & | ~ ^ ) */
		BitwiseOp = 35,
	}

	export enum Symbol {
		Semicolon = 36,
		Colon = 37,
		Dot = 38,
		Comma = 39,
	}

	export enum AssignmentOperator {
		Equals = 40,

		PlusEquals = 41,
		MinusEquals = 42,
		AsteriskEquals = 43,
		SlashEquals = 44,
		PercentEquals = 45,

		/** <<= */
		LessThanLessThanEquals = 46,
		/** >>= */
		GreaterThanGreaterThanEquals = 47,
		/** >>>= */
		GreaterThanGreaterThanGreaterThanEquals = 48,
		/** &= */
		AmpersandEquals = 49,
		/** |= */
		BarEquals = 50,
		/** ^= */
		CaretEquals = 51,
	}

	export enum ComparisonOperator {
		GreaterThan = 52,
		LessThan = 53,
		GreaterThanEquals = 54,
		LessThanEquals = 55,
		EqualsEquals = 56,
		ExclamationEquals = 57,
	}

	export enum UnaryOperator {
		/** Increment ( ++ ) */
		PlusPlus = 58,
		/** Decrement ( -- ) */
		MinusMinus = 59,

		/** ~ */
		Tilda = 60,

		/** ! */
		Exclamation = 61,
	}

	export enum LogicalOperator {
		/** && */
		AmpersandAmpersand = 62,
		/** || */
		BarBar = 63,
	}

	export enum BitwiseOperator {
		/** & */
		Ampersand = 64,
		/** | */
		Bar = 65,
		/** ^ */
		Caret = 66,

		/** Bitwise LEFT SHIFT ( << ) */
		LessThanLessThan = 67,
		/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
		GreaterThanGreaterThan = 68,
		/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
		GreaterThanGreaterThanGreaterThan = 69,
	}

	export enum Group {
		/** ( */
		OpenParen = 70,
		/** ) */
		CloseParen = 71,
		/** { */
		OpenBrace = 72,
		/** } */
		CloseBrace = 73,
		/** [ */
		OpenBracket = 74,
		/** ] */
		CloseBracket = 75,
		/** " */
		DoubleQuote = 76,
		/** ' */
		SingleQuote = 77,
	}

	export enum Type {
		__STRING__ = 78,
		__NUMBER__ = 79,
		__BOOLEAN__ = 80,
		__NIL__ = 81,
		__OBJECT__ = 82,
		__FUNCTION__ = 83,
		__ARRAY__ = 84,
		__CLASS__ = 85,
	}

	export enum Special {
		/** Type declaration */
		__TYPE = 86,
		/** COmment */
		__COMMENT__ = 87,
		/** End Of File */
		__EOF__ = 88,
	}
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: Token['id'],
	type: Token['type'],
	nodeGroup: NodeType,
	value: string
): Token {
	const token = {
		id,
		type,
		value,
		nodeGroup,
		__GSC: {
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
			_LENGTH: null,
		},
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

const tokens: Array<{
	id: Token['id'];
	type: Token['type'];
	nodeGroup: NodeType;
	value: string;
}> = [
	// Literals
	{
		id: TokenID.Literal._True,
		type: Node.Literal.IDENTIFIER,
		nodeGroup: 'Literal',
		value: 'true',
	},
	{
		id: TokenID.Literal._False,
		type: Node.Literal.IDENTIFIER,
		nodeGroup: 'Literal',
		value: 'false',
	},
	{
		id: TokenID.Literal._Undefined,
		type: Node.Literal.IDENTIFIER,
		nodeGroup: 'Literal',
		value: 'undefined',
	},
	{
		id: TokenID.Literal._Null,
		type: Node.Literal.IDENTIFIER,
		nodeGroup: 'Literal',
		value: 'null',
	},

	// Keywords
	{
		id: TokenID.Keyword.Var,
		type: Node.Keyword.Var,
		nodeGroup: 'Keyword',
		value: 'var',
	},
	{
		id: TokenID.Keyword.Const,
		type: Node.Keyword.Const,
		nodeGroup: 'Keyword',
		value: 'const',
	},

	{
		id: TokenID.Keyword.Function,
		type: Node.Keyword.Function,
		nodeGroup: 'Keyword',
		value: 'function',
	},
	{
		id: TokenID.Keyword.Return,
		type: Node.Keyword.Return,
		nodeGroup: 'Keyword',
		value: 'return',
	},

	{
		id: TokenID.Keyword.Class,
		type: Node.Keyword.Class,
		nodeGroup: 'Keyword',
		value: 'class',
	},
	{
		id: TokenID.Keyword.Constructor,
		type: Node.Keyword.Constructor,
		nodeGroup: 'Keyword',
		value: 'constructor',
	},
	{
		id: TokenID.Keyword.Private,
		type: Node.Keyword.Private,
		nodeGroup: 'Keyword',
		value: 'Private',
	},
	{
		id: TokenID.Keyword.Public,
		type: Node.Keyword.Public,
		nodeGroup: 'Keyword',
		value: 'public',
	},
	{
		id: TokenID.Keyword.Static,
		type: Node.Keyword.Static,
		nodeGroup: 'Keyword',
		value: 'static',
	},
	{
		id: TokenID.Keyword.New,
		type: Node.Keyword.New,
		nodeGroup: 'Keyword',
		value: 'new',
	},
	{
		id: TokenID.Keyword._This,
		type: Node.Literal.IDENTIFIER,
		nodeGroup: 'Keyword',
		value: 'this',
	},

	{
		id: TokenID.Keyword.If,
		type: Node.Keyword.If,
		nodeGroup: 'Keyword',
		value: 'if',
	},
	{
		id: TokenID.Keyword.Else,
		type: Node.Keyword.Else,
		nodeGroup: 'Keyword',
		value: 'else',
	},

	{
		id: TokenID.Keyword.Switch,
		type: Node.Keyword.Switch,
		nodeGroup: 'Keyword',
		value: 'switch',
	},
	{
		id: TokenID.Keyword.Case,
		type: Node.Keyword.Case,
		nodeGroup: 'Keyword',
		value: 'case',
	},
	{
		id: TokenID.Keyword.Default,
		type: Node.Keyword.Default,
		nodeGroup: 'Keyword',
		value: 'default',
	},

	{
		id: TokenID.Keyword.For,
		type: Node.Keyword.For,
		nodeGroup: 'Keyword',
		value: 'for',
	},
	{
		id: TokenID.Keyword.While,
		type: Node.Keyword.While,
		nodeGroup: 'Keyword',
		value: 'while',
	},
	{
		id: TokenID.Keyword.Break,
		type: Node.Keyword.Break,
		nodeGroup: 'Keyword',
		value: 'break',
	},
	{
		id: TokenID.Keyword.Continue,
		type: Node.Keyword.Continue,
		nodeGroup: 'Keyword',
		value: 'continue',
	},

	{
		id: TokenID.Keyword.Import,
		type: Node.Keyword.Import,
		nodeGroup: 'Keyword',
		value: 'import',
	},
	{
		id: TokenID.Keyword.Export,
		type: Node.Keyword.Export,
		nodeGroup: 'Keyword',
		value: 'export',
	},
	{
		id: TokenID.Keyword.From,
		type: Node.Keyword.From,
		nodeGroup: 'Keyword',
		value: 'from',
	},
	{
		id: TokenID.Keyword.As,
		type: Node.Keyword.As,
		nodeGroup: 'Keyword',
		value: 'as',
	},

	{
		id: TokenID.Keyword.ThrowError,
		type: Node.Keyword.ThrowError,
		nodeGroup: 'Keyword',
		value: 'throwError',
	},

	{
		id: TokenID.Keyword.Try,
		type: Node.Keyword.Try,
		nodeGroup: 'Keyword',
		value: 'try',
	},
	{
		id: TokenID.Keyword.Catch,
		type: Node.Keyword.Catch,
		nodeGroup: 'Keyword',
		value: 'catch',
	},

	// Operations
	{
		id: TokenID.Operation.BinOp,
		type: Node.Symbol.Plus,
		nodeGroup: 'Operation',
		value: '+',
	},
	{
		id: TokenID.Operation.BinOp,
		type: Node.Symbol.Minus,
		nodeGroup: 'Operation',
		value: '-',
	},
	{
		id: TokenID.Operation.BinOp,
		type: Node.Symbol.Multiply,
		nodeGroup: 'Operation',
		value: '*',
	},
	{
		id: TokenID.Operation.BinOp,
		type: Node.Symbol.Divide,
		nodeGroup: 'Operation',
		value: '/',
	},
	{
		id: TokenID.Operation.BinOp,
		type: Node.Symbol.Modulo,
		nodeGroup: 'Operation',
		value: '%',
	},

	// Symbols
	{
		id: TokenID.Symbol.Semicolon,
		type: Node.Symbol.Semicolon,
		nodeGroup: 'Symbol',
		value: ';',
	},
	{
		id: TokenID.Symbol.Colon,
		type: Node.Symbol.Colon,
		nodeGroup: 'Symbol',
		value: ':',
	},
	{
		id: TokenID.Symbol.Dot,
		type: Node.Symbol.Dot,
		nodeGroup: 'Symbol',
		value: '.',
	},
	{
		id: TokenID.Symbol.Comma,
		type: Node.Symbol.Comma,
		nodeGroup: 'Symbol',
		value: ',',
	},

	// Assignment Operators
	{
		id: TokenID.AssignmentOperator.Equals,
		type: Node.AssignmentOperator.Equals,
		nodeGroup: 'AssignmentOperator',
		value: '=',
	},

	{
		id: TokenID.AssignmentOperator.PlusEquals,
		type: Node.AssignmentOperator.AsgAdd,
		nodeGroup: 'AssignmentOperator',
		value: '+=',
	},
	{
		id: TokenID.AssignmentOperator.MinusEquals,
		type: Node.AssignmentOperator.AsgMin,
		nodeGroup: 'AssignmentOperator',
		value: '-=',
	},
	{
		id: TokenID.AssignmentOperator.AsteriskEquals,
		type: Node.AssignmentOperator.AsgMult,
		nodeGroup: 'AssignmentOperator',
		value: '*=',
	},
	{
		id: TokenID.AssignmentOperator.SlashEquals,
		type: Node.AssignmentOperator.AsgDiv,
		nodeGroup: 'AssignmentOperator',
		value: '/=',
	},
	{
		id: TokenID.AssignmentOperator.PercentEquals,
		type: Node.AssignmentOperator.AsgMod,
		nodeGroup: 'AssignmentOperator',
		value: '%=',
	},

	{
		id: TokenID.AssignmentOperator.LessThanLessThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseLShift,
		nodeGroup: 'AssignmentOperator',
		value: '<<=',
	},
	{
		id: TokenID.AssignmentOperator.GreaterThanGreaterThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseSRShift,
		nodeGroup: 'AssignmentOperator',
		value: '>>=',
	},
	{
		id: TokenID.AssignmentOperator.GreaterThanGreaterThanGreaterThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseZFRShift,
		nodeGroup: 'AssignmentOperator',
		value: '>>>=',
	},
	{
		id: TokenID.AssignmentOperator.AmpersandEquals,
		type: Node.AssignmentOperator.AsgBitwiseAND,
		nodeGroup: 'AssignmentOperator',
		value: '&=',
	},
	{
		id: TokenID.AssignmentOperator.BarEquals,
		type: Node.AssignmentOperator.AsgBitwiseOR,
		nodeGroup: 'AssignmentOperator',
		value: '|=',
	},
	{
		id: TokenID.AssignmentOperator.CaretEquals,
		type: Node.AssignmentOperator.AsgBitwiseXOR,
		nodeGroup: 'AssignmentOperator',
		value: '^=',
	},

	// Comparison Operators
	{
		id: TokenID.ComparisonOperator.GreaterThan,
		type: Node.ComparisonOperator.GreaterThan,
		nodeGroup: 'ComparisonOperator',
		value: '>',
	},
	{
		id: TokenID.ComparisonOperator.LessThan,
		type: Node.ComparisonOperator.LessThan,
		nodeGroup: 'ComparisonOperator',
		value: '<',
	},
	{
		id: TokenID.ComparisonOperator.GreaterThanEquals,
		type: Node.ComparisonOperator.GreaterThanOrEquals,
		nodeGroup: 'ComparisonOperator',
		value: '>=',
	},
	{
		id: TokenID.ComparisonOperator.LessThanEquals,
		type: Node.ComparisonOperator.LessThanOrEquals,
		nodeGroup: 'ComparisonOperator',
		value: '<=',
	},
	{
		id: TokenID.ComparisonOperator.EqualsEquals,
		type: Node.ComparisonOperator.IsEqual,
		nodeGroup: 'ComparisonOperator',
		value: '==',
	},
	{
		id: TokenID.ComparisonOperator.ExclamationEquals,
		type: Node.ComparisonOperator.NotEqual,
		nodeGroup: 'ComparisonOperator',
		value: '!=',
	},

	// Unary Operators
	{
		id: TokenID.UnaryOperator.PlusPlus,
		type: Node.UnaryOperator.Increment,
		nodeGroup: 'UnaryOperator',
		value: '++',
	},
	{
		id: TokenID.UnaryOperator.MinusMinus,
		type: Node.UnaryOperator.Decrement,
		nodeGroup: 'UnaryOperator',
		value: '--',
	},

	{
		id: TokenID.UnaryOperator.Tilda,
		type: Node.UnaryOperator.Bitwise_NOT,
		nodeGroup: 'UnaryOperator',
		value: '~',
	},

	{
		id: TokenID.UnaryOperator.Exclamation,
		type: Node.UnaryOperator.LogicalNOT,
		nodeGroup: 'UnaryOperator',
		value: '!',
	},

	// Logical Operators
	{
		id: TokenID.LogicalOperator.AmpersandAmpersand,
		type: Node.LogicalOperator.LogicalAND,
		nodeGroup: 'LogicalOperator',
		value: '&&',
	},
	{
		id: TokenID.LogicalOperator.BarBar,
		type: Node.LogicalOperator.LogicalOR,
		nodeGroup: 'LogicalOperator',
		value: '||',
	},

	// Bitwise Operators
	{
		id: TokenID.BitwiseOperator.Ampersand,
		type: Node.BitwiseOperator.Bitwise_AND,
		nodeGroup: 'BitwiseOperator',
		value: '&',
	},
	{
		id: TokenID.BitwiseOperator.Bar,
		type: Node.BitwiseOperator.Bitwise_OR,
		nodeGroup: 'BitwiseOperator',
		value: '|',
	},
	{
		id: TokenID.BitwiseOperator.Caret,
		type: Node.BitwiseOperator.Bitwise_XOR,
		nodeGroup: 'BitwiseOperator',
		value: '^',
	},

	{
		id: TokenID.BitwiseOperator.LessThanLessThan,
		type: Node.BitwiseOperator.Bitwise_LShift,
		nodeGroup: 'BitwiseOperator',
		value: '<<',
	},
	{
		id: TokenID.BitwiseOperator.GreaterThanGreaterThan,
		type: Node.BitwiseOperator.Bitwise_SRShift,
		nodeGroup: 'BitwiseOperator',
		value: '>>',
	},
	{
		id: TokenID.BitwiseOperator.GreaterThanGreaterThanGreaterThan,
		type: Node.BitwiseOperator.Bitwise_ZFRShift,
		nodeGroup: 'BitwiseOperator',
		value: '>>>',
	},

	// Groups
	{
		id: TokenID.Group.OpenParen,
		type: Node.Group.OpenParen,
		nodeGroup: 'Group',
		value: '(',
	},
	{
		id: TokenID.Group.CloseParen,
		type: Node.Group.CloseParen,
		nodeGroup: 'Group',
		value: ')',
	},
	{
		id: TokenID.Group.OpenBrace,
		type: Node.Group.OpenBrace,
		nodeGroup: 'Group',
		value: '{',
	},
	{
		id: TokenID.Group.CloseBrace,
		type: Node.Group.CloseBrace,
		nodeGroup: 'Group',
		value: '}',
	},
	{
		id: TokenID.Group.OpenBracket,
		type: Node.Group.OpenBracket,
		nodeGroup: 'Group',
		value: '[',
	},
	{
		id: TokenID.Group.CloseBracket,
		type: Node.Group.CloseBracket,
		nodeGroup: 'Group',
		value: ']',
	},
	{
		id: TokenID.Group.DoubleQuote,
		type: Node.Group.DoubleQuote,
		nodeGroup: 'Group',
		value: '"',
	},
	{
		id: TokenID.Group.SingleQuote,
		type: Node.Group.SingleQuote,
		nodeGroup: 'Group',
		value: "'",
	},

	// Special
	{
		id: TokenID.Type.__STRING__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'string',
	},
	{
		id: TokenID.Type.__NUMBER__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'number',
	},
	{
		id: TokenID.Type.__BOOLEAN__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'boolean',
	},
	{
		id: TokenID.Type.__NIL__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'nil',
	}, // serves as null or undefined
	{
		id: TokenID.Type.__OBJECT__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'object',
	},
	{
		id: TokenID.Type.__FUNCTION__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'Function',
	},
	{
		id: TokenID.Type.__ARRAY__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'array',
	},
	{
		id: TokenID.Type.__CLASS__,
		type: Node.Special.__TYPE,
		nodeGroup: 'Special',
		value: 'class',
	},

	{
		id: TokenID.Special.__COMMENT__,
		type: Node.Special.__COMMENT__,
		nodeGroup: 'Special',
		value: '//',
	},

	{
		id: TokenID.Special.__EOF__,
		type: Node.Special.__EOF__,
		nodeGroup: 'Special',
		value: '<EOF>',
	},
];

tokens.forEach(({ id, type, nodeGroup, value }) => {
	setTokenData(id, type, nodeGroup, value);
});

export { Tokens };
