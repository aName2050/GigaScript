import {
    BinaryExpr,
    Expr,
    Identifier,
    NumericLiteral,
    Program,
    Stmt,
} from '../ast/ast';
import { tokenize } from '../lexer/lexer';
import { Token, TokenType } from '../types';

/**
 * Produces valid AST from source.
 */
export default class Parser {
    private tokens: Token[] = [];

    /**
     * Determine if parsing is complete by reaching the END OF FILE token.
     */
    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    /**
     * Returns current token
     */
    private at(): Token {
        return this.tokens[0] as Token;
    }

    /**
     * Returns the previous token then shifts the token array to the next token.
     */
    private eat(): Token {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    /**
     * Returns the previous token and then shifts the token array to the next token.
     * Also checks the type of the expected token and throws an error if it doesn't match.
     */
    private expect(type: TokenType, err: any): Token {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error(`ParseError:\n${err} ${prev} - Expecting: ${type}`);
            process.exit(1);
        }

        return prev;
    }

    public generateAST(source: string): Program {
        this.tokens = tokenize(source);
        const program: Program = {
            kind: 'Program',
            body: [],
        };

        // Parse until end of file
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    /**
     * Handle complex statements
     */
    private parse_stmt(): Stmt {
        // skip to parse_expr
        return this.parse_expr();
    }

    /**
     * Handle expressions
     */
    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }

    /**
     * Handle addition (+) and subtraction (-) operations
     */
    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicitave_expr();
        while (this.at().value == '+' || this.at().value == '-') {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    /**
     * Handle multiplication (*), division (/), and modulo (%) operations
     */
    private parse_multiplicitave_expr(): Expr {
        let left = this.parse_primary_expr();

        while (
            this.at().value == '/' ||
            this.at().value == '*' ||
            this.at().value == '%'
        ) {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    /**
     * Parse literal values and grouping expressions
     */
    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        // Figure which token we are at and return its literal value
        switch (tk) {
            // User defined values
            case TokenType.Identifier:
                return {
                    kind: 'Identifier',
                    symbol: this.eat().value,
                } as Identifier;

            // Constants and numeric constants
            case TokenType.Number:
                return {
                    kind: 'NumericLiteral',
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.OpenParan: {
                this.eat(); // eat the opening paren
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    `Expected ")" and instead saw ${value}`
                ); // expect closing paren

                return value;
            }

            default:
                console.error(`ParseError: Unexpected token: `, this.at());
                process.exit(1);
        }
    }
}
