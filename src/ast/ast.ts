export type ASTNodeType =
	// Statements
	| 'Program'
	| 'VariableDeclaration'
	| 'FunctionDeclaration'
	| 'ReturnStatement'
	| 'ClassDeclaration'
	| 'ClassConstructorStatement'
	| 'ClassMethodDeclaration'
	| 'ClassPropertyDeclaration'
	| 'IfStatement'
	| 'SwitchStatement'
	| 'CaseStatement'
	| 'DefaultStatement'
	| 'ForStatement'
	| 'WhileStatement'
	| 'BreakStatement'
	| 'ContinueStatement'
	| 'TryCatchStatement'
	| 'ThrowErrorStatement'
	| 'TypeDeclaration'
	| 'CodeBlockNode'
	| 'EOF'
	// Expressions
	| 'BinaryExpr'
	| 'BitwiseExpr'
	| 'AssignmentExpr'
	| 'CallExpr'
	| 'ChildExpr'
	| 'ObjectProperty'
	// Literals
	| 'StringLiteral'
	| 'NumberLiteral'
	| 'ObjectLiteral'
	| 'ArrayLiteral'
	| 'Identifier';

export interface GSASTNode {
	kind: ASTNodeType;
	start: {
		Line: number;
		Column: number;
	};
	end: {
		Line: number;
		Column: number;
	};
}

export type GSTypes =
	| 'string'
	| 'number'
	| 'boolean'
	| 'nil'
	| 'object'
	| 'Function'
	| 'Array'
	| 'Class'
	| 'any';

/**
 * Statements don't return a value at runtime.
 * They can contain multiple expressions
 */
export interface STATEMENT extends GSASTNode {}

/**
 * Expressions will return a value at runtime.
 */
export interface EXPRESSION extends GSASTNode {}

export interface Program extends STATEMENT {
	kind: 'Program';
	body: Array<STATEMENT>;
}

export interface CodeBlockNode extends STATEMENT {
	kind: 'CodeBlockNode';
	body: Array<STATEMENT>;
}

export interface EOFNode extends GSASTNode {
	kind: 'EOF';
	value: '<EOF>';
}
