export type NodeType =
	// STATEMENTS
	| 'Program'
	| 'VarDeclaration'
	| 'FunctionDeclaration'
	| 'ReturnStatement'
	| 'ClassDeclaration'
	| 'ClassConstructor'
	| 'IfStatement'
	| 'TryCatchStatement'
	| 'ForStatement'
	| 'WhileStatement'
	| 'BreakStatement'
	| 'ContinueStatement'
	| 'ImportStatement'
	| 'ExportStatement'
	| 'ThrowStatement'
	// EXPRESSIONS
	| 'AssignmentExpr'
	| 'MemberExpr'
	| 'CallExpr'
	| 'ClassInitExpr'
	// LITERALS
	| 'Property'
	| 'ObjectLiteral'
	| 'NumericLiteral'
	| 'StringLiteral'
	| 'Identifier'
	| 'BinaryExpr'
	// CLASSES
	| 'ClassProperty'
	| 'ClassMethod';

/**
 * Statements don't result in a value at runtime
 * They contain one or several expressions internally
 */
export interface Stmt {
	kind: NodeType;
}

/**
 * Define a block which contains several statements
 * Only one program will be contained in each file
 */
export interface Program extends Stmt {
	kind: 'Program';
	body: Stmt[];
}

export interface VarDeclaration extends Stmt {
	kind: 'VarDeclaration';
	constant: boolean;
	identifier: string;
	value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
	kind: 'FunctionDeclaration';
	parameters: string[];
	name: string;
	body: Stmt[];
}

export interface ReturnStatement extends Stmt {
	kind: 'ReturnStatement';
	value: Expr;
}

export interface ClassDeclaration extends Stmt {
	kind: 'ClassDeclaration';
	name: string;
	properties: ClassProperty[];
	methods: ClassMethod[];
	constructor: Stmt;
}

export interface ClassProperty extends Expr {
	kind: 'ClassProperty';
	public: boolean;
	identifier: string;
	value?: Expr;
}

export interface ClassMethod extends Expr {
	kind: 'ClassMethod';
	public: boolean;
	identifier: string;
	parameters: string[];
	body: Stmt[];
}

export interface ClassConstructor extends Stmt {
	kind: 'ClassConstructor';
	parameters: string[];
	body: Stmt[];
}

export interface ClassInit extends Expr {
	kind: 'ClassInitExpr';
	name: string;
	args: Expr[];
}

export interface IfStatement extends Stmt {
	kind: 'IfStatement';
	test: Expr;
	body: Stmt[];
	alt?: Stmt[];
}

export interface TryCatchStatement extends Stmt {
	kind: 'TryCatchStatement';
	body: Stmt[];
	alt: Stmt[];
}

export interface ForStatement extends Stmt {
	kind: 'ForStatement';
	init: VarDeclaration;
	test: Expr;
	update: AssignmentExpr;
	body: Stmt[];
}

export interface WhileStatement extends Stmt {
	kind: 'WhileStatement';
	test: Expr;
	body: Stmt[];
}

export interface BreakStatement extends Stmt {
	kind: 'BreakStatement';
}

export interface ContinueStatement extends Stmt {
	kind: 'ContinueStatement';
}

export interface ImportStatement extends Stmt {
	kind: 'ImportStatement';
	variable: string;
	file: string;
}

export interface ExportStatement extends Stmt {
	kind: 'ExportStatement';
	identifier: string;
	exportedValue: Expr;
}

export interface ThrowStatement extends Stmt {
	kind: 'ThrowStatement';
	message: Expr;
}

/**
 * Expressions will result in a value at runtime
 */
export interface Expr extends Stmt {}

/**
 * An expression reassigning a variable to another value
 */
export interface AssignmentExpr extends Expr {
	kind: 'AssignmentExpr';
	assigne: Expr;
	value: Expr;
}

/**
 * An operation with two sides seperated by an operator.
 *
 * Both sides can by any complex expression.
 *
 * Supported operators:
 *  - \+
 *  - \-
 *  - \*
 *  - /
 *  - %
 */
export interface BinaryExpr extends Expr {
	kind: 'BinaryExpr';
	left: Expr;
	right: Expr;
	operator: string; // must be of type BinaryOperator
}

/**
 * An expression that makes a call
 */
export interface CallExpr extends Expr {
	kind: 'CallExpr';
	args: Expr[];
	caller: Expr;
}

/**
 * An expression used to access the properties of an object
 */
export interface MemberExpr extends Expr {
	kind: 'MemberExpr';
	object: Expr;
	property: Identifier;
	computed: boolean;
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * User defined variable or symbol
 */
export interface Identifier extends Expr {
	kind: 'Identifier';
	symbol: string;
}

/**
 * A numeric constant
 */
export interface NumericLiteral extends Expr {
	kind: 'NumericLiteral';
	value: number;
}

/**
 * A string constant
 */
export interface StringLiteral extends Expr {
	kind: 'StringLiteral';
	value: string;
}

/**
 * A key: value property for objects
 */
export interface Property extends Expr {
	kind: 'Property';
	key: string;
	value?: Expr;
}

/**
 * Object literal structure.
 *
 * Contains many key: value pairs.
 */
export interface ObjectLiteral extends Expr {
	kind: 'ObjectLiteral';
	properties: Property[];
}
