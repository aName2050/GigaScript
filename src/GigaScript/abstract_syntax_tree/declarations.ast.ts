import { EXPRESSION, STATEMENT } from './base.ast';

export interface VariableDeclaration extends STATEMENT {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
}
