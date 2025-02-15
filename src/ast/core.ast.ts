import { GSASTNode } from './types.ast';

/**
 * Statements don't return a value at runtime,
 * but can contain many expressions
 */
export interface Statement extends GSASTNode {}

/**
 * Expressions return a value at runtime
 */
export interface Expression extends GSASTNode {}

export interface Program extends Statement {
	kind: 'Program';
	body: Statement[];
}

export interface CodeBlockNode extends Statement {
	kind: 'CodeBlockNode';
	body: Statement[];
}

export interface EOFNode extends GSASTNode {
	kind: 'EOF';
	value: '<EOF>';
}
