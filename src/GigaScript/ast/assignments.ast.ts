import { EXPRESSION } from './ast';
import { Identifier } from './literals.ast';

/**
 * Reassigns a variable to another value, using the "=" operator
 */
export interface AssignmentExpr extends EXPRESSION {
	kind: 'AssignmentExpr';
	assigne: EXPRESSION;
	value: EXPRESSION;
	AsgOp: '&=' | '|=' | '^=' | '<<=' | '>>=' | '>>>=' | '=';
}
