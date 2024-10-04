import { EXPRESSION } from '../ast';

export interface CallExpr extends EXPRESSION {
	kind: 'CallExpr';
	args: EXPRESSION[];
	caller: EXPRESSION;
}
