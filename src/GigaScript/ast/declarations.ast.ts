import { STATEMENT, EXPRESSION } from './ast';

/** Var declaration */
export interface VariableDeclaration extends STATEMENT {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
}

/** Function declaration */
export interface FunctionDeclaration extends STATEMENT {
	kind: 'FunctionDeclaration';
	parameters: Array<string>;
	name: string;
	body: Array<STATEMENT>;
}
