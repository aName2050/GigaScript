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
		| Node.Symbol.Modulo;
}
