import { NodeType } from '../nodes';
import { EXPRESSION } from './ast';

/**
 * An operation with two sides seperated by an operator.
 *
 * Each side can consist of more expressions
 */
export interface BitwiseExpr extends EXPRESSION {
	kind: 'BitwiseExpr';
	lhs: EXPRESSION;
	rhs: EXPRESSION;
	// bitwise op "~" (NOT operator) handled as unary expr
	op:
		| NodeType.Bitwise_AND
		| NodeType.Bitwise_OR
		| NodeType.Bitwise_XOR
		| NodeType.Bitwise_LShift
		| NodeType.Bitwise_SRShift
		| NodeType.Bitwise_ZFRShift;
}
