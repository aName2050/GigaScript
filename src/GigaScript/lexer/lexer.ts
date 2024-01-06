import { isAlpha, isInt, isSkippable, token } from './lexerUtil';
import { Token, TokenType } from '../types';

/**
 * Reserved keywords for GigaScript
 */
const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,
    func: TokenType.Func,
};

export function tokenize(source: string): Token[] {
    const tokens = new Array<Token>();
    const src = source.split('');

    // Make tokens till EOF
    while (src.length > 0) {
        // Handle one character tokens
        if (src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParan));
        } else if (src[0] == ')') {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == '{') {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        } else if (src[0] == '}') {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        } else if (src[0] == '[') {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        } else if (src[0] == ']') {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        } else if (
            src[0] == '+' ||
            src[0] == '-' ||
            src[0] == '*' ||
            src[0] == '/' ||
            src[0] == '%'
        ) {
            // Binary Operations (left side and right side operations)
            tokens.push(token(src.shift(), TokenType.BinOp));
        }
        // Handle conditionals and assignments
        else if (src[0] == '=') {
            // Handle conditionals and assignments
            tokens.push(token(src.shift(), TokenType.Equals));
        } else if (src[0] == ';') {
            tokens.push(token(src.shift(), TokenType.Semicolon));
        } else if (src[0] == ':') {
            tokens.push(token(src.shift(), TokenType.Colon));
        } else if (src[0] == ',') {
            tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == '.') {
            tokens.push(token(src.shift(), TokenType.Dot));
        } else {
            // Handle multicharacter tokens
            // Handle numeric literals
            if (isInt(src[0])) {
                let num = '';
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }

                // Add new numeric token
                tokens.push(token(num, TokenType.Number));
            }
            // Handle keywords and indentifier tokens
            else if (isAlpha(src[0])) {
                let ident = '';
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (typeof reserved == 'number') {
                    tokens.push(token(ident, reserved));
                } else {
                    // Unknown name is most likely user defined symbol
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isSkippable(src[0])) {
                // Skip over whitespace characters
                src.shift();
            }
            // Handle unknown characters
            else {
                console.error(
                    `LexerError: Unknown character: UNICODE-${src[0].charCodeAt(
                        0
                    )} ${src[0]}`
                );
                process.exit(1);
            }
        }
    }

    tokens.push({ value: 'EndOfFile', type: TokenType.EOF });

    return tokens;
}
