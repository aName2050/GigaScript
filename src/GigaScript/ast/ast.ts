export type NodeType =
    // STATEMENTS
    | 'Program'
    | 'VarDeclaration'
    // EXPRESSIONS
    | 'AssignmentExpr'
    // LITERALS
    | 'Property'
    | 'ObjectLiteral'
    | 'NumericLiteral'
    | 'Identifier'
    | 'BinaryExpr';

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
