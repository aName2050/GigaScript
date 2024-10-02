import { CodeBlockNode, EXPRESSION, GSType, STATEMENT } from '../ast';

export interface VariableDeclaration extends STATEMENT {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	value?: EXPRESSION;
	valueType?: GSType;
}

export interface FunctionDeclaration extends STATEMENT {
	kind: 'FunctionDeclaration';
	parameters: { [key: string]: GSType };
	name: string;
	body: CodeBlockNode;
	returnType?: GSType;
}
