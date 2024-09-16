import { CodeBlockNode, EXPRESSION, STATEMENT } from '../ast';

export interface VariableDeclaration extends STATEMENT {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
}

export interface FunctionDeclaration extends STATEMENT {
	kind: 'FunctionDeclaration';
	parameters: Array<string>;
	name: string;
	body: CodeBlockNode;
}
