import { OpPrec } from './lexer/types';
import { NodeType } from './nodes';
import { Token, TokenID } from './tokens';

let GSX_Tokens: Record<string, Token> = {};

export function getGSXTokenByValue(value: string): Token | undefined {
	return GSX_Tokens[value];
}

/**
 *
 * @param id The ID of the token
 * @param type The type of the token
 * @param value The raw value of the token
 * @param Line Line number the first character of the token was found on
 * @param Column Column number the first character of the token was found on
 * @returns A new token
 */
export function createGSXToken(
	id: TokenID,
	type: NodeType,
	value: string,
	PositionData: {
		start: {
			line: number;
			column: number;
		};
		end: {
			line: number;
			column: number;
		};
	},
	OPC?: OpPrec
): Token {
	return {
		id,
		type,
		value,
		__GSC: {
			_OPC: getGSXTokenByValue(value)?.__GSC._OPC || OPC,
			_POS: {
				start: {
					Line: PositionData.start.line,
					Column: PositionData.start.column,
				},
				end: {
					Line: PositionData.end.line,
					Column: PositionData.end.column,
				},
			},
		},
	} as Token;
}

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

	GSX_Tokens[value] = token;

	return token;
}

// [keywords]
setTokenData(TokenID._True, NodeType.Identifier, 'nocap', OpPrec.None);
setTokenData(TokenID._False, NodeType.Identifier, 'cap', OpPrec.None);

setTokenData(TokenID.Let, NodeType.Let, 'lit', OpPrec.None);
setTokenData(TokenID.Const, NodeType.Const, 'bro', OpPrec.None);
setTokenData(TokenID.Func, NodeType.Func, 'bruh', OpPrec.None);
setTokenData(TokenID.Return, NodeType.Return, 'return', OpPrec.None);

setTokenData(TokenID.Class, NodeType.Class, 'students', OpPrec.None);
setTokenData(TokenID.Constructor, NodeType.Constructor, 'builder', OpPrec.None);
setTokenData(TokenID.Private, NodeType.Private, 'introvert', OpPrec.None);
setTokenData(TokenID.Public, NodeType.Public, 'extrovert', OpPrec.None);
setTokenData(TokenID.Static, NodeType.Static, 'unchanged', OpPrec.None);
setTokenData(TokenID.New, NodeType.New, 'new', OpPrec.None);
setTokenData(TokenID._This, NodeType.Identifier, 'this', OpPrec.None);

setTokenData(TokenID.If, NodeType.If, 'sus', OpPrec.None);
setTokenData(TokenID.Else, NodeType.Else, 'imposter', OpPrec.None);

setTokenData(TokenID.While, NodeType.While, 'while', OpPrec.None);
setTokenData(TokenID.For, NodeType.For, 'for', OpPrec.None);
setTokenData(TokenID.Continue, NodeType.Continue, 'moveAlong', OpPrec.None);
setTokenData(TokenID.Break, NodeType.Break, 'justStop', OpPrec.None);

setTokenData(TokenID.Import, NodeType.Import, 'yoink', OpPrec.None);
setTokenData(TokenID.Export, NodeType.Export, 'yeet', OpPrec.None);
setTokenData(TokenID.From, NodeType.From, 'from', OpPrec.None);
setTokenData(TokenID.As, NodeType.As, 'as', OpPrec.Assignment);

setTokenData(TokenID.Throw, NodeType.Throw, '💀', OpPrec.None);

setTokenData(TokenID.Try, NodeType.Try, 'messAround', OpPrec.None);
setTokenData(TokenID.Catch, NodeType.Catch, 'findOut', OpPrec.None);

// [symbols]
// binary operation
setTokenData(TokenID.BinOp, NodeType.Plus, 'with', OpPrec.Additive);
setTokenData(TokenID.BinOp, NodeType.Minus, 'without', OpPrec.Additive);
setTokenData(TokenID.BinOp, NodeType.Multiply, 'times', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, NodeType.Divide, 'divide', OpPrec.Multiplicative);
setTokenData(TokenID.BinOp, NodeType.Modulo, '%', OpPrec.Multiplicative);
// bitwise operations
setTokenData(TokenID.Ampersand, NodeType.Bitwise_AND, '&', OpPrec.BITWISE_AND);
setTokenData(TokenID.Bar, NodeType.Bitwise_OR, '|', OpPrec.BITWISE_OR);
setTokenData(TokenID.Caret, NodeType.Bitwise_XOR, '^', OpPrec.BITWISE_XOR);
setTokenData(TokenID.Tilda, NodeType.Bitwise_NOT, '~', OpPrec.None);
setTokenData(
	TokenID.LessThanLessThan,
	NodeType.Bitwise_LShift,
	'<<',
	OpPrec.BITWISE_SHIFT
);
setTokenData(
	TokenID.GreaterThanGreaterThan,
	NodeType.Bitwise_SRShift,
	'>>',
	OpPrec.BITWISE_SHIFT
);
setTokenData(
	TokenID.GreaterThanGreaterThanGreaterThan,
	NodeType.Bitwise_ZFRShift,
	'>>>',
	OpPrec.BITWISE_SHIFT
);

// punctation
setTokenData(TokenID.Semicolon, NodeType.Semicolon, 'rn', OpPrec.None);
setTokenData(TokenID.Colon, NodeType.Colon, ':', OpPrec.None);
setTokenData(TokenID.Dot, NodeType.Dot, '.', OpPrec.None);
setTokenData(TokenID.Comma, NodeType.Comma, ',', OpPrec.None);

// [assignments]
setTokenData(TokenID.Equals, NodeType.Equals, 'be', OpPrec.Assignment);
setTokenData(TokenID.PlusEquals, NodeType.AsgAdd, 'beWith', OpPrec.Assignment);
setTokenData(
	TokenID.MinusEquals,
	NodeType.AsgMin,
	'beWithout',
	OpPrec.Assignment
);
setTokenData(TokenID.AsteriskEquals, NodeType.AsgMult, '*=', OpPrec.Assignment);
setTokenData(TokenID.SlashEquals, NodeType.AsgDiv, '/=', OpPrec.Assignment);
setTokenData(TokenID.PercentEquals, NodeType.AsgMod, '%=', OpPrec.Assignment);

setTokenData(
	TokenID.AmpersandEquals,
	NodeType.Bitwise_AsgAND,
	'&=',
	OpPrec.Assignment
);
setTokenData(
	TokenID.BarEquals,
	NodeType.Bitwise_AsgOR,
	'|=',
	OpPrec.Assignment
);
setTokenData(
	TokenID.CaretEquals,
	NodeType.Bitwise_AsgXOR,
	'^=',
	OpPrec.Assignment
);
setTokenData(
	TokenID.LessThanLessThanEquals,
	NodeType.Bitwise_AsgLShift,
	'<<=',
	OpPrec.Assignment
);
setTokenData(
	TokenID.GreaterThanGreaterThanEquals,
	NodeType.Bitwise_AsgSRShift,
	'>>=',
	OpPrec.Assignment
);
setTokenData(
	TokenID.GreaterThanGreaterThanGreaterThanEquals,
	NodeType.Bitwise_AsgZFRShift,
	'>>>=',
	OpPrec.Assignment
);

// [unary]
setTokenData(TokenID.PlusPlus, NodeType.Increment, '++', OpPrec.Unary);
setTokenData(TokenID.MinusMinus, NodeType.Decrement, '--', OpPrec.None);

// [comparisons]
setTokenData(TokenID.GreaterThan, NodeType.GreaterThan, 'big', OpPrec.None);
setTokenData(TokenID.LessThan, NodeType.LessThan, 'lil', OpPrec.None);
setTokenData(
	TokenID.GreaterThanEquals,
	NodeType.GreaterThanOrEquals,
	'bigfr',
	OpPrec.None
);
setTokenData(
	TokenID.LessThanEquals,
	NodeType.LessThanOrEquals,
	'lilfr',
	OpPrec.None
);
setTokenData(TokenID.EqualsEquals, NodeType.IsEqual, 'frfr', OpPrec.Equality);
setTokenData(
	TokenID.ExclamationEquals,
	NodeType.NotEqual,
	'notfr',
	OpPrec.Equality
);
// [logical expressions]
setTokenData(TokenID.Exclamation, NodeType.Not, '!', OpPrec.Unary);
setTokenData(
	TokenID.AmpersandAmpersand,
	NodeType.And,
	'aswell',
	OpPrec.LOGIC_AND
);
setTokenData(TokenID.BarBar, NodeType.Or, 'carenot', OpPrec.LOGIC_OR);

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

export { GSX_Tokens };
