import { isAlpha, isInt, isSkippable, token } from './lexerUtil';
import { Token, TokenType } from '../types';

/**
 * Reserved keywords for GigaScript
 */
const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,

    func: TokenType.Func,

    if: TokenType.If,
    else: TokenType.Else,
};

/**
 * Token lookup (does not include special tokens)
 */
const TOKENS: Record<string, TokenType> = {
    '(': TokenType.OpenParen,
    ')': TokenType.CloseParen,

    '{': TokenType.OpenBrace,
    '}': TokenType.CloseBrace,

    '[': TokenType.OpenBracket,
    ']': TokenType.CloseBracket,

    '+': TokenType.BinOp,
    '-': TokenType.BinOp,
    '*': TokenType.BinOp,
    '/': TokenType.BinOp,
    '%': TokenType.BinOp,

    ';': TokenType.Semicolon,
    ':': TokenType.Colon,
    ',': TokenType.Comma,
    '.': TokenType.Dot,

    '<': TokenType.LessThan,
    '>': TokenType.GreaterThan,

    '|': TokenType.Bar,
};

export function tokenize(source: string): Token[] {
    const tokens = new Array<Token>();
    const src = source.split('');

    console.log('tokenizing:', source);

    // Make tokens till EOF
    while (src.length > 0) {
        const curr = src[0];
        const TOKEN = TOKENS[curr];

        console.log('curr:', curr);

        // allow for both positive and negative numbers
        if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
            let num: string = src.shift() || ''; // move past first digit or negative sign
            let decimalPointFound = false; // if number has digits in the decimal place
            while (src.length > 0) {
                if (src[0] == '.' && !decimalPointFound) {
                    // only allow a single decimal point
                    decimalPointFound = true;
                    num += src.shift();
                } else if (isInt(src[0])) {
                    num += src.shift();
                } else break;
            }

            tokens.push(token(num, TokenType.Number));
        } else if (typeof TOKEN == 'number') {
            // Matches a single character token in TOKENS
            tokens.push(token(src.shift(), TOKEN));
        } else {
            // handle multicharacter tokens and special tokens
            switch (curr) {
                // handle tokens that can be in a single character or multicharacter form
                case '=':
                    src.shift(); // go past first equals to check if there is another
                    if (src[0] == '=') {
                        src.shift(); // ISEQUAL comparison found
                        tokens.push(token('==', TokenType.IsEqual));
                    } else {
                        tokens.push(token('=', TokenType.Equals));
                    }
                    break;

                case '&':
                    src.shift(); // go past first & and check for second one
                    if (src[0] == '&') {
                        src.shift(); // AND comparison found
                        tokens.push(token('&&', TokenType.And));
                    } else {
                        tokens.push(token('&', TokenType.Ampersand));
                    }
                    break;

                case '|':
                    console.log('| found! val before .shift():', src[0]);
                    src.shift(); // go past first | and check for second one
                    console.log('val after .shift():', src[0]);
                    if (src[0] == '|') {
                        src.shift(); // OR comparison found
                        tokens.push(token('||', TokenType.Or));
                    } else {
                        tokens.push(token('|', TokenType.Bar));
                    }
                    break;

                case '!':
                    src.shift(); // go past ! to check for equals sign
                    if (src[0] == '=') {
                        src.shift(); // NOTEQUAL comparison found
                        tokens.push(token('!=', TokenType.NotEquals));
                    } else {
                        tokens.push(token('!', TokenType.Exclamation));
                    }
                    break;

                case '"': // string support
                    let str = '';
                    src.shift(); // move past opening doubleQuotes, indicating beginning of string

                    while (src.length > 0 && src[0] !== '"') {
                        str += src.shift();
                    }

                    src.shift(); // advance past closing doubleQuotes, indicating end of string

                    tokens.push(token(str, TokenType.String));
                    break;

                default:
                    if (isAlpha(curr, false)) {
                        // The first character of an identifier can be alphabetic or an underscore
                        let ident = '';
                        ident += src.shift();

                        while (src.length > 0 && isAlpha(src[0])) {
                            // Identifier can consist of alphanumeric or underscores after first character
                            ident += src.shift();
                        }

                        // check for reserved keywords
                        const RESERVED = KEYWORDS[ident];
                        if (typeof RESERVED == 'number') {
                            tokens.push(token(ident, RESERVED));
                        } else {
                            // Unknown identifier most likely means user defined symbol
                            tokens.push(token(ident, TokenType.Identifier));
                        }
                    } else if (isSkippable(src[0])) {
                        // ignore whitespace characters
                        src.shift();
                    } else {
                        // handle unknown characters
                        // TODO: implement error handling and recovery

                        console.error(
                            `LexerError: Unknown character: UNICODE-${src[0].charCodeAt(
                                0
                            )} ${src[0]}`
                        );
                        process.exit(1);
                    }
            }
        }
    }

    tokens.push({ value: 'EOF', type: TokenType.EOF });

    console.log(tokens);

    return tokens;
}
