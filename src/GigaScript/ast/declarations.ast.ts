import { STATEMENT, EXPRESSION } from './ast';

/** Var declaration */
export interface VarDeclaration extends STATEMENT {
	kind: 'VarDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
}

/** Function declaration */
export interface FuncDeclaration extends STATEMENT {
	kind: 'FuncDeclaration';
	parameters: Array<string>;
	name: string;
	body: Array<STATEMENT>;
}
