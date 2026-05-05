import { Token } from '../../types/token';
import { NodeType } from '../../types/token.node';
import { Symbol } from '../../types/token.symbol';

let Tokens: Record<string, Token> = {};
function declareToken(symbol: Symbol, type: NodeType, raw: string): void {
	const token: Token = {
		symbol,
		type,
		value: raw,
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
		},
	};

	Tokens[raw] = token;
	return;
}

// Literals
declareToken(Symbol._True, NodeType.Identifier, 'true');
declareToken(Symbol._False, NodeType.Identifier, 'false');
declareToken(Symbol._Undefined, NodeType.Identifier, 'undefined');

// Keywords
declareToken(Symbol.Let, NodeType.Let, 'let');
declareToken(Symbol.Const, NodeType.Const, 'const');
declareToken(Symbol.Func, NodeType.Func, 'func');
declareToken(Symbol.Return, NodeType.Return, 'return');

// Binary Operators
declareToken(Symbol.Plus, NodeType.BinaryOperator, '+');
declareToken(Symbol.Minus, NodeType.BinaryOperator, '-');
declareToken(Symbol.Asterisk, NodeType.BinaryOperator, '*');
declareToken(Symbol.ForwardSlash, NodeType.BinaryOperator, '/');
declareToken(Symbol.PercentSign, NodeType.BinaryOperator, '%');

// Assignment Operators
declareToken(Symbol.Equals, NodeType.Equals, '=');

// Special
declareToken(Symbol.__SOF__, NodeType.__SOF__, '<SOF>');
declareToken(Symbol.__EOF__, NodeType.__EOF__, '<EOF>');
