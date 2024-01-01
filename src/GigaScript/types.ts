// [ LEXER ]

// Contains the tokens that are parser understands
export enum TokenType {
    // Literal Types (USER_DEFINED)
    Number,
    Identifier, // Variable names, function names, etc.

    // Keywords (RESERVED)
    Let,

    // Grouping + Operators
    BinOp, // Binary operator
    Equals,
    OpenParan, // (
    CloseParen, // )
}

// Represents a single token in the language
export interface Token {
    value: string; // the raw value as seen in the language
    type: TokenType; // token structure
}
