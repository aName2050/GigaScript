import { CodeBlockNode, EXPRESSION, GSTypes, STATEMENT } from '../ast';

export interface VariableDeclaration extends STATEMENT {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
	valueType?: GSTypes;
}

export interface FunctionDeclaration extends STATEMENT {
	kind: 'FunctionDeclaration';
	parameters: Record<string, GSTypes>;
	name: string;
	body: CodeBlockNode;
	returnType?: GSTypes;
}
