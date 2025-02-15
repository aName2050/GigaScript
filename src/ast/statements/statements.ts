import { Expression, Statement } from '../core.ast';

export interface ReturnStatement extends Statement {
	kind: 'ReturnStatement';
	value: Expression;
}
