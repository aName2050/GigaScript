import {
    BinaryExpr,
    Expr,
    Identifier,
    NumericLiteral,
    Program,
    Stmt,
    VarDeclaration,
    AssignmentExpr,
    Property,
    ObjectLiteral,
    MemberExpr,
    CallExpr,
    FunctionDeclaration,
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
     * Determine if parsing the current line is complete by reaching the CR and/or LF tokens
     */
    private not_eol(): boolean {
        // TODO:
        throw new Error('Method not implemented');
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
            console.error(
                `ParseError: ${err}`,
                prev,
                `- Expecting: type`,
                type
            );
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
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();
            case TokenType.Func:
                return this.parse_func_declaration();

            default:
                return this.parse_expr();
        }
    }

    /**
     * Handle function declarations
     *
     * func IDENT (...args) {
     *    ...code
     * }
     */
    private parse_func_declaration(): Stmt {
        this.eat(); // advance past func keyword
        const name = this.expect(
            TokenType.Identifier,
            'Expected identifier following func keyword.'
        ).value;

        const args = this.parse_args();
        const params: string[] = [];
        for (const arg of args) {
            if (arg.kind !== 'Identifier') {
                console.log(arg);
                throw 'Expected paramters to of type string.';
            }

            params.push((arg as Identifier).symbol);
        }

        this.expect(
            TokenType.OpenBrace,
            'Expected "{" following function declaration.'
        );
        const body: Stmt[] = [];

        while (
            this.at().type !== TokenType.EOF &&
            this.at().type !== TokenType.CloseBrace
        ) {
            body.push(this.parse_stmt());
        }

        this.expect(
            TokenType.CloseBrace,
            'Expected "}" after function declaration.'
        );

        const func = {
            body,
            name,
            parameters: params,
            kind: 'FunctionDeclaration',
        } as FunctionDeclaration;

        return func;
    }

    /**
     * Handle variable declarations
     *
     * let IDENT;
     * (let | const) IDENT = EXPR;
     *
     * Semicolons (;) are required for variable declarations
     */
    private parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            'Expected identifier following variable declaration keywords.'
        ).value;

        if (this.at().type == TokenType.Semicolon) {
            this.eat(); // eat semicolon
            if (isConstant) {
                throw 'ParseError: Constant values must be declared with a value.';
            }

            return {
                kind: 'VarDeclaration',
                constant: false,
                identifier,
            } as VarDeclaration;
        }

        this.expect(
            TokenType.Equals,
            'Unexpected token. Expected "=" following identifier for variable declaration.'
        );

        const declaration = {
            kind: 'VarDeclaration',
            value: this.parse_expr(),
            identifier,
            constant: isConstant,
        } as VarDeclaration;

        this.expect(
            TokenType.Semicolon,
            'Variable declaration statements must end with a semicolon.'
        );

        return declaration;
    }

    /**
     * Handle expressions
     */
    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    /**
     * Handle variable reassignments
     */
    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat(); // advance past equals token
            const value = this.parse_assignment_expr();
            return {
                value,
                assigne: left,
                kind: 'AssignmentExpr',
            } as AssignmentExpr;
        }

        return left;
    }

    private parse_object_expr(): Expr {
        // { Prop[] }
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_additive_expr();
        }

        this.eat(); // advance past the open brace
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            const key = this.expect(
                TokenType.Identifier,
                'Expected key for key: value pair declaration.'
            ).value;

            // Allows object key: value shortcut
            // { key, }
            if (this.at().type == TokenType.Comma) {
                this.eat(); // advance past the comma
                properties.push({ key, kind: 'Property' } as Property);
                continue;
            }
            // { key }
            else if (this.at().type == TokenType.CloseBrace) {
                properties.push({ key, kind: 'Property' } as Property);
                continue;
            }

            // { key: value }
            this.expect(TokenType.Colon, 'Expected colon after identifier');
            const value = this.parse_expr();

            properties.push({ kind: 'Property', value, key });
            if (this.at().type != TokenType.CloseBrace) {
                this.expect(
                    TokenType.Comma,
                    'Expected comma or closing brace following property declaration.'
                );
            }
        }

        this.expect(
            TokenType.CloseBrace,
            'Expected closing brace when defined an object'
        );
        return { kind: 'ObjectLiteral', properties } as ObjectLiteral;
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
        let left = this.parse_call_member_expr();

        while (
            this.at().value == '/' ||
            this.at().value == '*' ||
            this.at().value == '%'
        ) {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    // foo.bar()()
    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr();

        if (this.at().type == TokenType.OpenParan) {
            return this.parse_call_expr(member);
        }

        return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
            kind: 'CallExpr',
            caller,
            args: this.parse_args(),
        } as CallExpr;

        if (this.at().type == TokenType.OpenParan) {
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(
            TokenType.OpenParan,
            'Expected "(" after function identifier.'
        );
        const args =
            this.at().type == TokenType.CloseParen
                ? []
                : this.parse_arguments_list();

        this.expect(
            TokenType.CloseParen,
            'Expected ")" after function parameters'
        );
        return args;
    }

    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];

        while (this.at().type == TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (
            this.at().type == TokenType.Dot ||
            this.at().type == TokenType.OpenBracket
        ) {
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;

            // non-computed values, like foo.bar
            if (operator.type == TokenType.Dot) {
                computed = false;
                // get ident
                property = this.parse_primary_expr();
                if (property.kind != 'Identifier') {
                    throw 'Cannot use dot operator without valid identifier.';
                }
            } else {
                // adds suport for foo[bar]
                computed = true;
                property = this.parse_expr();
                this.expect(
                    TokenType.CloseBracket,
                    'Expected "]" at end of object member expression'
                );
            }

            object = {
                kind: 'MemberExpr',
                object,
                property,
                computed,
            } as MemberExpr;
        }

        return object;
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
