import { Expression } from '../core.ast';

export interface Literal extends Expression {
	kind: 'StringLiteral' | 'NumberLiteral' | 'ObjectLiteral' | 'Identifier';
}

export interface Identifier extends Literal {
	kind: 'Identifier';
	symbol: string;
}

export interface StringLiteral extends Literal {
	kind: 'StringLiteral';
	value: string;
}

export interface NumberLiteral extends Literal {
	kind: 'NumberLiteral';
	value: number;
}

export interface ObjectLiteral extends Literal {
	kind: 'ObjectLiteral';
	value: ObjectProperty[];
}

export interface ObjectProperty extends Expression {
	kind: 'ObjectProperty';
	key: string;
	value?: Expression;
}
