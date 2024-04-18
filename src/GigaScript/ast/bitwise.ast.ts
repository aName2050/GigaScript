import { EXPRESSION } from './ast';

/**
 * An operation with two sides seperated by an operator.
 *
 * Each side can consist of more expressions
 */
export interface BitwiseExpr extends EXPRESSION {
	kind: 'BitwiseExpr';
	lhs: EXPRESSION;
	rhs: EXPRESSION;
	// bitwise op "~" (NOT operator) handle as unary expr
	op: '&' | '|' | '^' | '<<' | '>>' | '>>>';
}
