import { EXPRESSION } from '../ast';

export interface Identifier extends EXPRESSION {
	kind: 'Identifier';
	symbol: string;
}

export interface Literal extends EXPRESSION {
	kind:
		| 'StringLiteral'
		| 'NumberLiteral'
		| 'ObjectLiteral'
		| 'ArrayLiteral'
		| 'Identifier';
}

export interface NumberLiteral extends Literal {
	kind: 'NumberLiteral';
	value: number;
}

export interface StringLiteral extends Literal {
	kind: 'StringLiteral';
	value: string;
}

export interface ObjectLiteral extends Literal {
	kind: 'ObjectLiteral';
	properties: ObjectProperty[];
}

export interface ObjectProperty extends EXPRESSION {
	kind: 'ObjectProperty';
	key: string;
	value?: EXPRESSION;
}

export interface ArrayLiteral extends Literal {
	kind: 'ArrayLiteral';
	elements: Literal[];
}
