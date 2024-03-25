export type ASTNodeType =
	// Statements
	| 'Program'
	| 'VariableDeclaration'
	| 'FunctionDeclaration'
	| 'ReturnStatement'
	// Expressions
	| 'AssignmentExpr'
	| 'UnaryExpr'
	| 'BinaryExpr'
	| 'BitwiseExpr'
	| 'CallExpr'
	| 'MemberExpr'
	// Literals
	| 'StringLiteral'
	| 'NumberLiteral'
	| 'ObjectProperty'
	| 'ObjectLiteral'
	| 'ArrayLiteral'
	| 'Identifier';

export interface ASTNode {
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

/**
 * Statements don't return a value at runtime.
 * They can contain multiple expressions
 */
export interface STATEMENT extends ASTNode {}

/**
 * Expressions will return a value at runtime.
 */
export interface EXPRESSION extends STATEMENT {}

/**
 * A program contains multiple statements.
 * A file can only contain one program.
 */
export interface Program extends STATEMENT {
	kind: 'Program';
	body: STATEMENT[];
}
