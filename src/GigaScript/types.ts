// [ LEXER ]

// Contains the tokens that are parser understands
export enum TokenType {
    // Literal Types (USER_DEFINED)
    Number, // 0-9
    Identifier, // Variable names, function names, etc.

    // Keywords
    Let, // Mutable variable declaration
    Const, // Constant variable declaration

    // Grouping + Operators
    BinOp, // Binary operator
    Equals, // =
    Comma, // ,
    Colon, // :
    Semicolon, // ;
    OpenParan, // (
    CloseParen, // )
    OpenBrace, // {
    CloseBrace, // }

    // Special
    EOF, // End Of File
}

// Represents a single token in the language
export interface Token {
    value: string; // the raw value as seen in the language
    type: TokenType; // token structure
}
