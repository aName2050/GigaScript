import { EXPRESSION } from '../ast';
import { Identifier, StringLiteral } from '../literals/literals.ast';

export interface CallExpr extends EXPRESSION {
	kind: 'CallExpr';
	args: EXPRESSION[];
	caller: EXPRESSION;
}

export interface MemberExpr extends EXPRESSION {
	kind: 'MemberExpr';
	object: EXPRESSION;
	property: Identifier | StringLiteral;
	computed: boolean;
}
