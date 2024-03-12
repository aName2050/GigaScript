import { Expr } from '../../../old/GigaScript/ast/ast';
import { EXPRESSION } from './ast';

export interface AssignmentExpr extends EXPRESSION {
	kind: 'AssignmentExpr';
	AsgOp: string;
	assigne: Expr;
	value: Expr;
}
