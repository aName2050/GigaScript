import { EXPRESSION } from './ast';

/**
 * User defined symbol
 */
export interface Identifier extends EXPRESSION {
	kind: 'Identifier';
	symbol: string;
}

export interface Literal extends EXPRESSION {
	kind: 'NumberLiteral' | 'StringLiteral';
	value: number | string;
}

/**
 * A number constant
 */
export interface NumberLiteral extends Literal {
	kind: 'NumberLiteral';
	value: number;
}

/**
 * A string constant
 */
export interface StringLiteral extends Literal {
	kind: 'StringLiteral';
	value: string;
}

/**
 * "key: value" properties for objects
 */
export interface Property extends EXPRESSION {
	kind: 'ObjectProperty';
	key: string;
	value?: EXPRESSION;
}

/**
 * An object structure
 * Contains many "key: value" pairs
 */
export interface ObjectLiteral extends EXPRESSION {
	kind: 'ObjectLiteral';
	properties: Array<Property>;
}

/**
 * An array structure
 *
 * Can contain a mix of numbers, strings, objects, and other arrays
 */
export interface ArrayLiteral extends EXPRESSION {
	kind: 'ArrayLiteral';
	elements: Array<ArrayElement['elements']>;
}

export interface ArrayElement {
	elements:
		| StringLiteral
		| NumberLiteral
		| ObjectLiteral
		| ArrayLiteral
		| Identifier;
}
