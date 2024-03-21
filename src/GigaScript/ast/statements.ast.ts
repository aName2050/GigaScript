import { EXPRESSION, STATEMENT } from './ast';

export interface ReturnStatement extends STATEMENT {
	kind: 'ReturnStatement';
	value: EXPRESSION;
}
