import { EXPRESSION } from './ast';
import { Identifier } from './literals.ast';

/**
 * Reassigns a value using using only one operand
 */
export interface UnaryExpr extends EXPRESSION {
	kind: 'UnaryExpr';
	assigne: EXPRESSION;
	operator: '++' | '--' | '~' | '!';
}
