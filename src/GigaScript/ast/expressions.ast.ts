import { CodeBlockNode, EXPRESSION } from './ast';
import { Identifier, StringLiteral } from './literals.ast';

export interface CallExpr extends EXPRESSION {
	kind: 'CallExpr';
	args: Array<EXPRESSION>;
	caller: EXPRESSION;
}

export interface MemberExpr extends EXPRESSION {
	kind: 'MemberExpr';
	object: EXPRESSION;
	property: Identifier | StringLiteral;
	computed: boolean;
}

export interface FunctionDeclarationExpr extends EXPRESSION {
	kind: 'FunctionDeclarationExpr';
	params: Array<string>;
	body: CodeBlockNode;
}
