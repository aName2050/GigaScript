import { AssignmentExpr } from './assignments.ast';
import { CodeBlockNode, EXPRESSION, STATEMENT } from './ast';
import { VariableDeclaration } from './declarations.ast';

export interface WhileStatement extends STATEMENT {
	kind: 'WhileStatement';
	test: EXPRESSION;
	body: CodeBlockNode;
}

export interface ForStatement extends STATEMENT {
	kind: 'ForStatement';
	initializer: VariableDeclaration;
	test: EXPRESSION;
	update: AssignmentExpr;
	body: CodeBlockNode;
}

export interface BreakStatement extends STATEMENT {
	kind: 'BreakStatement';
}

export interface ContinueStatement extends STATEMENT {
	kind: 'ContinueStatement';
}
