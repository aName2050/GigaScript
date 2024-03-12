import { Expr } from '../../../old/GigaScript/ast/ast';
import { EXPRESSION } from './ast';

/**
 * Reassigns a variable to another value, using the "=" operator
 */
export interface AssignmentExpr extends EXPRESSION {
	kind: 'AssignmentExpr';
	assigne: Expr;
	value: Expr;
	AsgOp: '&=' | '|=' | '^=' | '~=' | '<<=' | '>>=' | '>>>=';
}

/**
 * Reassigns a value using using only one operand
 */
export interface UnaryExpr extends EXPRESSION {
	kind: 'UnaryExpr';
	assigne: Expr;
	value: Expr;
	AsgOp: '++' | '--';
}
