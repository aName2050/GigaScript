import { isAlpha, isInt, isSkippable, token } from './lexerUtil';
import { Token, TokenType } from '../types';

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    null: TokenType.Null,
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
        } else if (
            src[0] == '+' ||
            src[0] == '-' ||
            src[0] == '*' ||
            src[0] == '/' ||
            src[0] == '%'
        ) {
            // Binary Operations (left side and right side operations)
            tokens.push(token(src.shift(), TokenType.BinOp));
        } else if (src[0] == '=') {
            // Handle conditionals and assignments
            tokens.push(token(src.shift(), TokenType.Equals));
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
