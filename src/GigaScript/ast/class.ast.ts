import { CodeBlockNode, EXPRESSION, STATEMENT } from './ast';

export interface ClassDeclaration extends STATEMENT {
	kind: 'ClassDeclaration';
	name: string;
	properties: Array<ClassProperty>;
	methods: Array<ClassMethod>;
	constructor: ConstructorStatement | undefined;
}

export interface ConstructorStatement extends STATEMENT {
	kind: 'ConstructorStatement';
	params: Array<string>;
	body: CodeBlockNode;
}

export interface ClassMethod extends STATEMENT {
	kind: 'ClassMethod';
	name: string;
	public: boolean;
	params: Array<string>;
	body: CodeBlockNode;
}

export interface ClassProperty extends STATEMENT {
	kind: 'ClassProperty';
	identifier: string;
	static: boolean;
	public: boolean;
	value?: EXPRESSION;
}

export interface ClassNewInstanceExpr extends EXPRESSION {
	kind: 'ClassNewInstanceExpr';
	name: string;
	args: Array<EXPRESSION>;
}
