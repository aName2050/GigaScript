import { Node } from '../../parser/nodes';
import { EXPRESSION } from '../ast';

export interface AssignmentExpression extends EXPRESSION {
	kind: 'AssignmentExpr';
	assigne: EXPRESSION;
	value: EXPRESSION;
	AsgOp:
		| Node.AssignmentOperator.Equals
		| Node.AssignmentOperator.AsgAdd
		| Node.AssignmentOperator.AsgMin
		| Node.AssignmentOperator.AsgMult
		| Node.AssignmentOperator.AsgDiv
		| Node.AssignmentOperator.AsgMod;
}
