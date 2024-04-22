import { CodeBlockNode, EXPRESSION } from './ast';
import { Identifier } from './literals.ast';

export interface CallExpr extends EXPRESSION {
	kind: 'CallExpr';
	args: Array<EXPRESSION>;
	caller: EXPRESSION;
}

export interface MemberExpr extends EXPRESSION {
	kind: 'MemberExpr';
	object: EXPRESSION;
	property: Identifier;
	computed: boolean;
}

export interface FunctionDeclarationExpr extends EXPRESSION {
	kind: 'FunctionDeclarationExpr';
	params: Array<string>;
	body: CodeBlockNode;
}
