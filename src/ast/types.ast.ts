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
		Line: number;
		Column: number;
	};
	end: {
		Line: number;
		Column: number;
	};
}

export type GSType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'object'
	| 'none'
	| 'any';
