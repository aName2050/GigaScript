import { NodeType } from '../nodes';
import { EXPRESSION } from './ast';

/**
 * Reassigns a value using using only one operand
 */
export interface UnaryExpr extends EXPRESSION {
	kind: 'UnaryExpr';
	assigne: EXPRESSION;
	operator:
		| NodeType.Increment
		| NodeType.Decrement
		| NodeType.Bitwise_NOT
		| NodeType.Not;
}
