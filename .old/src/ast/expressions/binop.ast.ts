import { Node } from '../../parser/nodes';
import { EXPRESSION } from '../ast';

export interface BinaryExpr extends EXPRESSION {
	kind: 'BinaryExpr';
	lhs: EXPRESSION;
	rhs: EXPRESSION;
	op:
		| Node.Symbol.Plus
		| Node.Symbol.Minus
		| Node.Symbol.Multiply
		| Node.Symbol.Divide
		| Node.Symbol.Modulo
		| Node.LogicalOperator.LogicalAND
		| Node.LogicalOperator.LogicalOR
		| Node.ComparisonOperator.NotEqual
		| Node.ComparisonOperator.IsEqual
		| Node.ComparisonOperator.LessThan
		| Node.ComparisonOperator.GreaterThan
		| Node.ComparisonOperator.LessThanOrEquals
		| Node.ComparisonOperator.GreaterThanOrEquals;
}
