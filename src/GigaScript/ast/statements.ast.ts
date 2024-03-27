import { CodeBlockNode, EXPRESSION, STATEMENT } from './ast';

export interface ReturnStatement extends STATEMENT {
	kind: 'ReturnStatement';
	value: EXPRESSION;
}

export interface TryCatchStatement extends STATEMENT {
	kind: 'TryCatchStatement';
	tryBody: CodeBlockNode;
	catchBody: CodeBlockNode;
	errorIdentifier: string;
}
