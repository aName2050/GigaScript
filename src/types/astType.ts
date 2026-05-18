export type AST_NodeType =
	// Statements
	| 'Program'
	| 'VariableDeclaration'
	// Expressions
	// Literals
	| 'Identifier'
	| 'NumberLiteral'
	// Special statements
	| 'EOF'
	| 'SOF'
	| 'EOL'
	| 'CodeBlockNode';
