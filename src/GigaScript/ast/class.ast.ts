import { EXPRESSION, STATEMENT } from './ast';

export interface ClassDeclaration extends STATEMENT {
	kind: 'ClassDeclaration';
}

export interface ConstructorStatement extends STATEMENT {
	kind: 'ConstructorStatement';
}

export interface ClassMethod extends STATEMENT {
	kind: 'ClassMethod';
}

export interface ClassProperty extends STATEMENT {
	kind: 'ClassProperty';
}

export interface ClassNewInstanceExpr extends EXPRESSION {
	kind: 'ClassNewInstanceExpr';
}
