import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export namespace TokenID {
	export enum Literal {
		/** Any number between 0 and 9 */
		_Number,
		/** Any combination of characters and numbers */
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
	}

	export enum Keyword {
		/** Mutable variable declaration */
		Var,
		/** Constant variable declaration */
		Const,

		/** Function declaration */
		Function,
		/** Return statement */
		Return,

		/** Class declaration */
		Class,
		/** Class constructor method */
		Constructor,
		/** Private method/property */
		Private,
		/** Public method/property */
		Public,
		/** Static method/property */
		Static,
		/** New class */
		New,
		/** See https://en.wikipedia.org/wiki/This_(computer_programming) */
		_This,

		/** If statement */
		If,
		/** Else statement */
		Else,

		/** Switch statement */
		Switch,
		/** Case statement */
		Case,
		/** Default statement */
		Default,

		/** While loop statement */
		While,
		/** For loop statement */
		For,
		/** Continue loop statement */
		Continue,
		/** Break loop statement */
		Break,

		/** Import external file statement */
		Import,
		/** Export value statement */
		Export,
		/** From file statement */
		From,
		/** As statement */
		As,

		/** Throw an exception */
		ThrowError,

		/** Try statement */
		Try,
		/** Catch statement */
		Catch,
	}

	export enum Operation {
		/** Binary operation ( + - * / % ) */
		BinOp,

		/** Bitwise Operation ( >> << & | ~ ^ ) */
		BitwiseOp,
	}

	export enum Symbol {
		Semicolon,
		Colon,
		Dot,
		Comma,
	}

	export enum AssignmentOperator {
		Equals,

		PlusEquals,
		MinusEquals,
		AsteriskEquals,
		SlashEquals,
		PercentEquals,

		/** <<= */
		LessThanLessThanEquals,
		/** >>= */
		GreaterThanGreaterThanEquals,
		/** >>>= */
		GreaterThanGreaterThanGreaterThanEquals,
		/** &= */
		AmpersandEquals,
		/** |= */
		BarEquals,
		/** ^= */
		CaretEquals,
	}

	export enum ComparisonOperator {
		GreaterThan,
		LessThan,
		GreaterThanEquals,
		LessThanEquals,
		EqualsEquals,
		ExclamationEquals,
	}

	export enum UnaryOperator {
		/** Increment ( ++ ) */
		PlusPlus,
		/** Decrement ( -- ) */
		MinusMinus,

		/** ~ */
		Tilda,

		/** ! */
		Exclamation,
	}

	export enum LogicalOperator {
		/** && */
		AmpersandAmpersand,
		/** || */
		BarBar,
	}

	export enum BitwiseOperator {
		/** & */
		Ampersand,
		/** | */
		Bar,
		/** ^ */
		Caret,

		/** Bitwise LEFT SHIFT ( << ) */
		LessThanLessThan,
		/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
		GreaterThanGreaterThan,
		/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
		GreaterThanGreaterThanGreaterThan,
	}

	export enum Group {
		/** ( */
		OpenParen,
		/** ) */
		CloseParen,
		/** { */
		OpenBrace,
		/** } */
		CloseBrace,
		/** [ */
		OpenBracket,
		/** ] */
		CloseBracket,
		/** " */
		DoubleQuote,
		/** ' */
		SingleQuote,
	}

	export enum Type {
		__STRING__,
		__NUMBER__,
		__BOOLEAN__,
		__NIL__,
		__OBJECT__,
		__FUNCTION__,
		__ARRAY__,
		__CLASS__,
	}

	export enum Special {
		/** Type declaration */
		__TYPE,
		/** COmment */
		__COMMENT__,
		/** End Of File */
		__EOF__,
	}
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: Token['id'],
	type: Token['type'],
	value: string
): Token {
	const token = {
		id,
		type,
		value,
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

const tokens: Array<{ id: Token['id']; type: Token['type']; value: string }> = [
	// Literals
	{ id: TokenID.Literal._True, type: Node.Literal.IDENTIFIER, value: 'true' },
	{
		id: TokenID.Literal._False,
		type: Node.Literal.IDENTIFIER,
		value: 'false',
	},
	{
		id: TokenID.Literal._Undefined,
		type: Node.Literal.IDENTIFIER,
		value: 'undefined',
	},
	{ id: TokenID.Literal._Null, type: Node.Literal.IDENTIFIER, value: 'null' },

	// Keywords
	{ id: TokenID.Keyword.Var, type: Node.Keyword.Var, value: 'var' },
	{ id: TokenID.Keyword.Const, type: Node.Keyword.Const, value: 'const' },

	{
		id: TokenID.Keyword.Function,
		type: Node.Keyword.Function,
		value: 'function',
	},
	{ id: TokenID.Keyword.Return, type: Node.Keyword.Return, value: 'return' },

	{ id: TokenID.Keyword.Class, type: Node.Keyword.Class, value: 'class' },
	{
		id: TokenID.Keyword.Constructor,
		type: Node.Keyword.Constructor,
		value: 'constructor',
	},
	{
		id: TokenID.Keyword.Private,
		type: Node.Keyword.Private,
		value: 'Private',
	},
	{ id: TokenID.Keyword.Public, type: Node.Keyword.Public, value: 'public' },
	{ id: TokenID.Keyword.Static, type: Node.Keyword.Static, value: 'static' },
	{ id: TokenID.Keyword.New, type: Node.Keyword.New, value: 'new' },
	{ id: TokenID.Keyword._This, type: Node.Literal.IDENTIFIER, value: 'this' },

	{ id: TokenID.Keyword.If, type: Node.Keyword.If, value: 'if' },
	{ id: TokenID.Keyword.Else, type: Node.Keyword.Else, value: 'else' },

	{ id: TokenID.Keyword.Switch, type: Node.Keyword.Switch, value: 'switch' },
	{ id: TokenID.Keyword.Case, type: Node.Keyword.Case, value: 'case' },
	{
		id: TokenID.Keyword.Default,
		type: Node.Keyword.Default,
		value: 'default',
	},

	{ id: TokenID.Keyword.For, type: Node.Keyword.For, value: 'for' },
	{ id: TokenID.Keyword.While, type: Node.Keyword.While, value: 'while' },
	{ id: TokenID.Keyword.Break, type: Node.Keyword.Break, value: 'break' },
	{
		id: TokenID.Keyword.Continue,
		type: Node.Keyword.Continue,
		value: 'continue',
	},

	{ id: TokenID.Keyword.Import, type: Node.Keyword.Import, value: 'import' },
	{ id: TokenID.Keyword.Export, type: Node.Keyword.Export, value: 'export' },
	{ id: TokenID.Keyword.From, type: Node.Keyword.From, value: 'from' },
	{ id: TokenID.Keyword.As, type: Node.Keyword.As, value: 'as' },

	{
		id: TokenID.Keyword.ThrowError,
		type: Node.Keyword.ThrowError,
		value: 'throwError',
	},

	{ id: TokenID.Keyword.Try, type: Node.Keyword.Try, value: 'try' },
	{ id: TokenID.Keyword.Catch, type: Node.Keyword.Catch, value: 'catch' },

	// Operations
	{ id: TokenID.Operation.BinOp, type: Node.Symbol.Plus, value: '+' },
	{ id: TokenID.Operation.BinOp, type: Node.Symbol.Minus, value: '-' },
	{ id: TokenID.Operation.BinOp, type: Node.Symbol.Multiply, value: '*' },
	{ id: TokenID.Operation.BinOp, type: Node.Symbol.Divide, value: '/' },
	{ id: TokenID.Operation.BinOp, type: Node.Symbol.Modulo, value: '%' },

	// Symbols
	{ id: TokenID.Symbol.Semicolon, type: Node.Symbol.Semicolon, value: ';' },
	{ id: TokenID.Symbol.Colon, type: Node.Symbol.Colon, value: ':' },
	{ id: TokenID.Symbol.Dot, type: Node.Symbol.Dot, value: '.' },
	{ id: TokenID.Symbol.Comma, type: Node.Symbol.Comma, value: ',' },

	// Assignment Operators
	{
		id: TokenID.AssignmentOperator.Equals,
		type: Node.AssignmentOperator.Equals,
		value: '=',
	},

	{
		id: TokenID.AssignmentOperator.PlusEquals,
		type: Node.AssignmentOperator.AsgAdd,
		value: '+=',
	},
	{
		id: TokenID.AssignmentOperator.MinusEquals,
		type: Node.AssignmentOperator.AsgMin,
		value: '-=',
	},
	{
		id: TokenID.AssignmentOperator.AsteriskEquals,
		type: Node.AssignmentOperator.AsgMult,
		value: '*=',
	},
	{
		id: TokenID.AssignmentOperator.SlashEquals,
		type: Node.AssignmentOperator.AsgDiv,
		value: '/=',
	},
	{
		id: TokenID.AssignmentOperator.PercentEquals,
		type: Node.AssignmentOperator.AsgMod,
		value: '%=',
	},

	{
		id: TokenID.AssignmentOperator.LessThanLessThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseLShift,
		value: '<<=',
	},
	{
		id: TokenID.AssignmentOperator.GreaterThanGreaterThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseSRShift,
		value: '>>=',
	},
	{
		id: TokenID.AssignmentOperator.GreaterThanGreaterThanGreaterThanEquals,
		type: Node.AssignmentOperator.AsgBitwiseZFRShift,
		value: '>>>=',
	},
	{
		id: TokenID.AssignmentOperator.AmpersandEquals,
		type: Node.AssignmentOperator.AsgBitwiseAND,
		value: '&=',
	},
	{
		id: TokenID.AssignmentOperator.BarEquals,
		type: Node.AssignmentOperator.AsgBitwiseOR,
		value: '|=',
	},
	{
		id: TokenID.AssignmentOperator.CaretEquals,
		type: Node.AssignmentOperator.AsgBitwiseXOR,
		value: '^=',
	},

	// Comparison Operators
	{
		id: TokenID.ComparisonOperator.GreaterThan,
		type: Node.ComparisonOperator.GreaterThan,
		value: '>',
	},
	{
		id: TokenID.ComparisonOperator.LessThan,
		type: Node.ComparisonOperator.LessThan,
		value: '<',
	},
	{
		id: TokenID.ComparisonOperator.GreaterThanEquals,
		type: Node.ComparisonOperator.GreaterThanOrEquals,
		value: '>=',
	},
	{
		id: TokenID.ComparisonOperator.LessThanEquals,
		type: Node.ComparisonOperator.LessThanOrEquals,
		value: '<=',
	},
	{
		id: TokenID.ComparisonOperator.EqualsEquals,
		type: Node.ComparisonOperator.IsEqual,
		value: '==',
	},
	{
		id: TokenID.ComparisonOperator.ExclamationEquals,
		type: Node.ComparisonOperator.NotEqual,
		value: '!=',
	},

	// Unary Operators
	{
		id: TokenID.UnaryOperator.PlusPlus,
		type: Node.UnaryOperator.Increment,
		value: '++',
	},
	{
		id: TokenID.UnaryOperator.MinusMinus,
		type: Node.UnaryOperator.Decrement,
		value: '--',
	},

	{
		id: TokenID.UnaryOperator.Tilda,
		type: Node.UnaryOperator.Bitwise_NOT,
		value: '~',
	},

	{
		id: TokenID.UnaryOperator.Exclamation,
		type: Node.UnaryOperator.LogicalNOT,
		value: '!',
	},

	// Logical Operators
	{
		id: TokenID.LogicalOperator.AmpersandAmpersand,
		type: Node.LogicalOperator.LogicalAND,
		value: '&&',
	},
	{
		id: TokenID.LogicalOperator.BarBar,
		type: Node.LogicalOperator.LogicalOR,
		value: '||',
	},

	// Bitwise Operators
	{
		id: TokenID.BitwiseOperator.Ampersand,
		type: Node.BitwiseOperator.Bitwise_AND,
		value: '&',
	},
	{
		id: TokenID.BitwiseOperator.Bar,
		type: Node.BitwiseOperator.Bitwise_OR,
		value: '|',
	},
	{
		id: TokenID.BitwiseOperator.Caret,
		type: Node.BitwiseOperator.Bitwise_XOR,
		value: '^',
	},

	{
		id: TokenID.BitwiseOperator.LessThanLessThan,
		type: Node.BitwiseOperator.Bitwise_LShift,
		value: '<<',
	},
	{
		id: TokenID.BitwiseOperator.GreaterThanGreaterThan,
		type: Node.BitwiseOperator.Bitwise_SRShift,
		value: '>>',
	},
	{
		id: TokenID.BitwiseOperator.GreaterThanGreaterThanGreaterThan,
		type: Node.BitwiseOperator.Bitwise_ZFRShift,
		value: '>>>',
	},

	// Groups
	{ id: TokenID.Group.OpenParen, type: Node.Group.OpenParen, value: '(' },
	{ id: TokenID.Group.CloseParen, type: Node.Group.CloseParen, value: ')' },
	{ id: TokenID.Group.OpenBrace, type: Node.Group.OpenBrace, value: '{' },
	{ id: TokenID.Group.CloseBrace, type: Node.Group.CloseBrace, value: '}' },
	{ id: TokenID.Group.OpenBracket, type: Node.Group.OpenBracket, value: '[' },
	{
		id: TokenID.Group.CloseBracket,
		type: Node.Group.CloseBracket,
		value: ']',
	},
	{ id: TokenID.Group.DoubleQuote, type: Node.Group.DoubleQuote, value: '"' },
	{ id: TokenID.Group.SingleQuote, type: Node.Group.SingleQuote, value: "'" },

	// Special
	{ id: TokenID.Type.__STRING__, type: Node.Special.__TYPE, value: 'string' },
	{ id: TokenID.Type.__NUMBER__, type: Node.Special.__TYPE, value: 'number' },
	{
		id: TokenID.Type.__BOOLEAN__,
		type: Node.Special.__TYPE,
		value: 'boolean',
	},
	{ id: TokenID.Type.__NIL__, type: Node.Special.__TYPE, value: 'nil' }, // serves as null or undefined
	{ id: TokenID.Type.__OBJECT__, type: Node.Special.__TYPE, value: 'object' },
	{
		id: TokenID.Type.__FUNCTION__,
		type: Node.Special.__TYPE,
		value: 'function',
	},
	{ id: TokenID.Type.__ARRAY__, type: Node.Special.__TYPE, value: 'array' },
	{ id: TokenID.Type.__CLASS__, type: Node.Special.__TYPE, value: 'class' },

	{
		id: TokenID.Special.__COMMENT__,
		type: Node.Special.__COMMENT__,
		value: '//',
	},

	{ id: TokenID.Special.__EOF__, type: Node.Special.__EOF__, value: '<EOF>' },
];

tokens.forEach(({ id, type, value }) => {
	setTokenData(id, type, value);
});

export { Tokens };
