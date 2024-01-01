export type NodeType =
    | 'Program'
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

/**
 * Expressions will result in a value at runtime
 */
export interface Expr extends Stmt {}

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

// LITERAL EXPRESSION TYPES
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
