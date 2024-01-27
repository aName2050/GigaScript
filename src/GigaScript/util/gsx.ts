import { isAlpha, isInt, isSkippable, token } from '../lexer/lexerUtil';
import { Token, TokenType } from '../types';

const KEYWORDS: Record<string, TokenType> = {
	lit: TokenType.Let,
	bro: TokenType.Const,

	bruh: TokenType.Func,

	sus: TokenType.If,
	imposter: TokenType.Else,

	yall: TokenType.For,

	yoink: TokenType.Import,
};

const TOKENS: Record<string, TokenType> = {
	'(': TokenType.OpenParen,
	')': TokenType.CloseParen,

	'{': TokenType.OpenBrace,
	'}': TokenType.CloseBrace,

	'[': TokenType.OpenBracket,
	']': TokenType.CloseBracket,

	',': TokenType.Comma,
	'.': TokenType.Dot,
};

export function readGSX(source: string): Token[] {
	const tokens = new Array<Token>();
	const src = source.split('');

	// Make tokens till EOF
	while (src.length > 0) {
		const curr = src[0];
		const TOKEN = TOKENS[curr];

		if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
			// handle numbers
			let num: string = src.shift()!; // advance past first digit or negative sign
			let decPointFound = false;
			while (src.length > 0) {
				if (src[0] == '.' && !decPointFound) {
					decPointFound = true;
					num += src.shift();
				} else if (isInt(src[0])) {
					num += src.shift();
				} else break;
			}

			tokens.push(token(num, TokenType.Number));
		} else if (typeof TOKEN == 'number') {
			tokens.push(token(src.shift(), TOKEN));
		} else {
			// multicharacter tokens + special tokens
			switch (curr) {
				case 'b':
					src.shift(); // advance past first character
					if (src[0] == 'e') {
						src.shift(); // "be" assignment token
						tokens.push(token('=', TokenType.Equals));
					} else if (src[0] == 't') {
						// "btw" ("&&") comparison found, advance past remainding characters
						src.shift();
						src.shift();
						tokens.push(token('&&', TokenType.And));
					} else if (src[0] == 'i' && src[1] == 'g') {
						// "big" (">") comparison found
						src.shift();
						src.shift();

						tokens.push(token('>', TokenType.GreaterThan));
					} else if (src[0] == 'y') {
						// "by" ("*") token found, advance past token
						src.shift();

						tokens.push(token('*', TokenType.BinOp));
					}
					break;

				case 'c':
					src.shift(); // advance past first character
					if (
						src[0] == 'a' &&
						src[1] == 'r' &&
						src[2] == 'e' &&
						src[3] == 'n' &&
						src[4] == 'o' &&
						src[5] == 't'
					) {
						// "carenot" comparison found, advance past "arenot" token remainder
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('||', TokenType.Or));
					} else if (src[0] == 'a' && src[1] == 'p') {
						// "cap" found (false), advance past
						src.shift();
						src.shift();

						tokens.push(token('false', TokenType.Identifier));
					}

					break;

				case 'f':
					src.shift(); // advance past first character
					if (src[0] == 'r' && src[1] == 'f' && src[2] == 'r') {
						// "frfr" comparison token found, advance past "rfr" token remainder
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('==', TokenType.IsEqual));
					}

					// TODO: fake (null)
					// TODO: findOut (catch)

					break;

				case 'i':
					src.shift(); // advance past first character
					if (src[0] == 's') {
						// "is" token found (:), advance past
						src.shift();

						tokens.push(token(':', TokenType.Colon));
					}

					break;

				case 'l':
					src.shift(); // advance past first token
					if (src[0] == 'i' && src[1] == 'l') {
						// "lil" token found, continue past
						src.shift();
						src.shift();

						tokens.push(token('<', TokenType.LessThan));
					} else if (
						src[0] == 'e' &&
						src[1] == 'f' &&
						src[2] == 't'
					) {
						// "left" found (%), advance past
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('%', TokenType.BinOp));
					}

					break;

				case 'm':
					// TODO: messAround (try)
					break;

				case 'n':
					src.shift(); // advance past first character
					if (src[0] == 'a' && src[1] == 'h') {
						// "nah" comparison token found, advance past "ah" token remainder
						src.shift();
						src.shift();

						tokens.push(token('!=', TokenType.NotEquals));
					} else if (
						src[0] == 'o' &&
						src[1] == 'c' &&
						src[2] == 'a' &&
						src[3] == 'p'
					) {
						// "nocap" (true) found, advance past
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('true', TokenType.Identifier));
					}

					// TODO: nerd (math)

					break;

				case 'r':
					src.shift(); // advance past first character
					if (src[0] == 'n') {
						// "rn" token found, advance past
						src.shift();

						tokens.push(token(';', TokenType.Semicolon));
					}

					break;

				case 's':
					src.shift(); // advance past first character
					if (src[0] == 'o' && src[1] == 'm' && src[2] == 'e') {
						// "some" found (/), advance past
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('/', TokenType.BinOp));
					}

					break;

				case 'w':
					src.shift(); // advance past first character
					if (src[0] == 'i' && src[1] == 't' && src[2] == 'h') {
						// "with" found, check if "without"
						if (src[3] == 'o' && src[4] == 'u' && src[5] == 't') {
							// "without" token (-) advance past token
							src.shift();
							src.shift();
							src.shift();

							src.shift();
							src.shift();
							src.shift();

							tokens.push(token('-', TokenType.BinOp));
						} else {
							// "with" token (+) advance past token
							src.shift();
							src.shift();
							src.shift();

							tokens.push(token('+', TokenType.BinOp));
						}
					} else if (
						src[0] == 'a' &&
						src[1] == 'f' &&
						src[2] == 'f' &&
						src[3] == 'l' &&
						src[4] == 'e'
					) {
						// "waffle" function (print) found, advance past
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('print', TokenType.Identifier));
					}

					break;

				// look for strings
				case '"':
					let str = '';
					src.shift(); // advance past opening quotes (begin string)

					while (src.length > 0 && src[0] !== '"') {
						str += src.shift();
					}

					src.shift(); // advance past closing quotes (end string)

					tokens.push(token(str, TokenType.String));

					break;

				default:
					if (isAlpha(curr, false)) {
						// first char of ident can be [a-zA-Z] or underscore
						let ident = '';
						ident += src.shift();

						while (src.length > 0 && isAlpha(src[0])) {
							ident += src.shift();
						}

						// check for reserved keywords that do not have a GSX version
						const RESERVED = KEYWORDS[ident];
						if (typeof RESERVED == 'number') {
							tokens.push(token(ident, RESERVED));
						} else {
							// user defined or native symbol (handles any native symbol that doesn't have GSX version)
							tokens.push(token(ident, TokenType.Identifier));
						}
					} else if (isSkippable(src[0])) {
						// ignore whitespace
						src.shift();
					} else {
						// handle unknown
						// TODO: implement error handling and recovery
						console.error(
							`GSXError: LexerError: Unknown character: UNICODE-${src[0].charCodeAt(
								0
							)} ${src[0]}`
						);
						process.exit(1);
					}

					break;
			}
		}
	}

	tokens.push({ value: 'EOF', type: TokenType.EOF });

	console.log(tokens);

	return tokens;
}
