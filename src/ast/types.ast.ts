export type ASTNodeType =
	// Statements
	| 'Program'
	| 'VariableDeclaration'
	| 'FunctionDeclaration'
	| 'ReturnStatement'
	| 'CodeBlockNode'
	| 'EOF'
	// Expressions
	| 'ObjectProperty'
	// Literals
	| 'StringLiteral'
	| 'NumberLiteral'
	| 'ObjectLiteral'
	| 'Identifier';

export interface GSASTNode {
	kind: ASTNodeType;
	start: {
		line: number;
		column: number;
	};
	end: {
		line: number;
		column: number;
	};
}

export type GSType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'object'
	| 'none'
	| 'any';
