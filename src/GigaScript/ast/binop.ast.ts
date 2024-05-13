import { NodeType } from '../nodes';
import { EXPRESSION } from './ast';

/**
 * An operation with two sides seperated by an operator.
 *
 * Each side can consist of more expressions
 */
export interface BinaryExpr extends EXPRESSION {
	kind: 'BinaryExpr';
	lhs: EXPRESSION;
	rhs: EXPRESSION;
	op:
		| NodeType.Plus
		| NodeType.Minus
		| NodeType.Multiply
		| NodeType.Divide
		| NodeType.Modulo
		| NodeType.And
		| NodeType.Or
		| NodeType.NotEqual
		| NodeType.IsEqual
		| NodeType.LessThan
		| NodeType.GreaterThan
		| NodeType.GreaterThanOrEquals
		| NodeType.LessThanOrEquals;
}
