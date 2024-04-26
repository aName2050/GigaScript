import { NodeType } from '../nodes';
import { EXPRESSION } from './ast';

/**
 * Reassigns a variable to another value, using the "=" operator
 */
export interface AssignmentExpr extends EXPRESSION {
	kind: 'AssignmentExpr';
	assigne: EXPRESSION;
	value: EXPRESSION;
	AsgOp:
		| NodeType.Equals
		| NodeType.AsgAdd
		| NodeType.AsgMin
		| NodeType.AsgMult
		| NodeType.AsgDiv
		| NodeType.AsgMod
		| NodeType.Bitwise_AsgLShift
		| NodeType.Bitwise_AsgSRShift
		| NodeType.Bitwise_AsgZFRShift
		| NodeType.Bitwise_AsgAND
		| NodeType.Bitwise_AsgOR
		| NodeType.Bitwise_AsgXOR;
}
