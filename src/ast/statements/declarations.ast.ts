import { CodeBlockNode, Expression, Statement } from '../core.ast';
import { GSType } from '../types.ast';

export interface VariableDeclaration extends Statement {
	kind: 'VariableDeclaration';
	constant: boolean;
	identifier: string;
	valueType: GSType;
	value?: Expression;
}

export interface FunctionDeclaration extends Statement {
	kind: 'FunctionDeclaration';
	parameters: { [key: string]: GSType };
	name: string;
	body: CodeBlockNode;
	returnType: GSType;
}
