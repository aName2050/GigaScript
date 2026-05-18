import { EXPRESSION } from './base.ast';

export interface Identifier extends EXPRESSION {
	kind: 'Identifier';
	value: string;
}

// TODO:
export interface Literal extends EXPRESSION {
	kind: 'NumberLiteral';
	value: number;
}

export interface NumberLiteral extends Literal {
	kind: 'NumberLiteral';
	value: number;
}
