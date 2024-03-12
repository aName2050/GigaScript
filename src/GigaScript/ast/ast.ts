export type ASTNodeType =
	// Statements
	| 'Program'
	| 'VarDeclaration'
	| 'FuncDeclaration'
	// Expressions
	| 'AssignmentExpr'
	// Literals
	| 'StringLiteral'
	| 'NumericLiteral'
	| 'Identifier'
	| 'BinaryExpr';

/**
 * Statements don't return a value at runtime.
 * They can contain multiple expressions
 */
export interface STATEMENT {
	kind: ASTNodeType;
}

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
