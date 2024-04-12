import { CodeBlockNode, EXPRESSION, STATEMENT } from './ast';

export interface IfStatement extends STATEMENT {
	kind: 'IfStatement';
	test: EXPRESSION;
	body: CodeBlockNode;
	alt?: Array<STATEMENT> | CodeBlockNode;
}
