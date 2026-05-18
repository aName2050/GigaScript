import { AST_NodeType } from '../../types/astType';

export interface ASTNode {
	kind: AST_NodeType;
	start: {
		Line: number;
		Column: number;
	};
	end: {
		Line: number;
		Column: number;
	};
}

export interface STATEMENT extends ASTNode {}

export interface EXPRESSION extends STATEMENT {}

export interface Program extends STATEMENT {
	kind: 'Program';
	body: STATEMENT[];
}

export interface CodeBlockNode extends STATEMENT {
	kind: 'CodeBlockNode';
	body: Array<STATEMENT>;
}

export interface EndOfFileNode extends ASTNode {
	kind: 'EOF';
	value: '<!EOF>';
}

export interface StartOfFileNode extends ASTNode {
	kind: 'SOF';
	value: '<!SOF>';
}

export interface EndOfLineNode extends ASTNode {
	kind: 'EOL';
	value: '<!EOL>';
}
