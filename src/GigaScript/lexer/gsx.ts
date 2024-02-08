import { isAlpha, isInt, isSkippable, token } from './lexerUtil';
import { Token, TokenType } from '../types';

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

/**
 * GSX Reserved Keywords
 */
const GSX_KEYWORDS: Record<string, { value: string; type: TokenType }> = {
	'be': { value: '=', type: TokenType.Equals },
	'btw': { value: '&&', type: TokenType.And },
	'big': { value: '>', type: TokenType.GreaterThan },
	'by': { value: '*', type: TokenType.BinOp },
	'bro': { value: 'const', type: TokenType.Const },
	'bruh': { value: 'func', type: TokenType.Func },

	'carenot': { value: '||', type: TokenType.Or },
	'cap': { value: 'false', type: TokenType.Identifier },

	'frfr': { value: '==', type: TokenType.IsEqual },
	'fake': { value: 'null', type: TokenType.Identifier },
	'findOut': { value: 'catch', type: TokenType.Identifier },

	'is': { value: ':', type: TokenType.Colon },
	'imposter': { value: 'else', type: TokenType.Else },

	'lil': { value: '<', type: TokenType.LessThan },
	'left': { value: '%', type: TokenType.BinOp },
	'lit': { value: 'let', type: TokenType.Let },

	'messAround': { value: 'try', type: TokenType.Identifier },

	'nah': { value: '!=', type: TokenType.NotEquals },
	'nocap': { value: 'true', type: TokenType.Identifier },
	'nerd': { value: 'math', type: TokenType.Identifier },

	'rn': { value: ';', type: TokenType.Semicolon },

	'waffle': { value: 'print', type: TokenType.Identifier },

	'yoink': { value: 'import', type: TokenType.Import },
	'yeet': { value: 'export', type: TokenType.Export },
};

// TODO: replace with GSX alt
/**
 * Non-GSX Reserved Keywords
 */
const KEYWORDS: Record<string, { value: string; type: TokenType }> = {
	'break': { value: 'break', type: TokenType.Break },

	'continue': { value: 'continue', type: TokenType.Continue },

	'from': { value: 'from', type: TokenType.From },

	'while': { value: 'while', type: TokenType.While },
};

export function tokenizeGSX(source: string): Token[] {
	let tokens = new Array<Token>();
	const src = source.split('');

	// make tokens till EOF
	while (src.length > 0) {
		const curr = src[0];
		const TOKEN = TOKENS[curr];

		if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
			// handle numbers
			let num: string = src.shift()!!; // advance past first digit or negative sign
			let decPointFound = false;
			while (src.length > 0) {
				if (src[0] == '.' && !decPointFound) {
					decPointFound = true;
					num += src.shift()!;
				} else if (isInt(src[0])) {
					num += src.shift()!;
				} else break;
			}

			// console.log('tokenized', num);
			tokens.push(token(num, TokenType.Number));
		} else if (typeof TOKEN == 'number') {
			// console.log('tokenized', TokenType[TOKEN]);
			tokens.push(token(src.shift(), TOKEN));
		} else {
			switch (curr) {
				case '"': // tokenize strings
					let str = '';
					src.shift(); // move past opening quotes

					while (src.length > 0 && src[0] !== '"') {
						str += src.shift();
					}

					src.shift(); // advance past closing quotes

					tokens.push(token(str, TokenType.String));
					break;

				default:
					if (isAlpha(curr, false)) {
						let ident = '';
						ident += src.shift();

						while (src.length > 0 && isAlpha(src[0])) {
							ident += src.shift();
						}

						const RESERVED = GSX_KEYWORDS[ident] || KEYWORDS[ident];
						if (typeof RESERVED?.type == 'number') {
							tokens.push(token(RESERVED.value, RESERVED.type));
						} else {
							tokens.push(token(ident, TokenType.Identifier));
						}
					} else if (isSkippable(src[0])) {
						src.shift();
					} else {
						console.error(
							`GSXLexerError: Unknown character: UNICODE-${src[0].charCodeAt(
								0
							)} ${src[0]}`
						);
						process.exit(1);
					}
					break;
			}
		}
	}

	tokens.push(token('EOF', TokenType.EOF));

	return tokens;
}

export function readGSX(source: string): Token[] {
	let tokens = new Array<Token>();
	const src = source.split('');

	// Make tokens till EOF
	while (src.length > 0) {
		const curr = src[0];
		const TOKEN = TOKENS[curr];

		if (isInt(curr) || (curr == '-' && isInt(src[1]))) {
			// handle numbers
			let num: string = src.shift()!!; // advance past first digit or negative sign
			let decPointFound = false;
			while (src.length > 0) {
				if (src[0] == '.' && !decPointFound) {
					decPointFound = true;
					num += src.shift()!;
				} else if (isInt(src[0])) {
					num += src.shift()!;
				} else break;
			}

			// console.log('tokenized', num);
			tokens.push(token(num, TokenType.Number));
		} else if (typeof TOKEN == 'number') {
			// console.log('tokenized', TokenType[TOKEN]);
			tokens.push(token(src.shift(), TOKEN));
		} else {
			// multicharacter tokens + special tokens
			switch (curr) {
				case 'r':
					const firstCharR = src.shift()!; // advance past first character
					if (src[0] == 'n') {
						// "rn" token found, advance past
						src.shift();

						tokens.push(token(';', TokenType.Semicolon));
					} else {
						src.unshift(firstCharR);
						tokens = handleSymbols(src, tokens);
					}

					break;

				case 's':
					const firstCharS = src.shift()!; // advance past first character
					if (src[0] == 'o' && src[1] == 'm' && src[2] == 'e') {
						// "some" found (/), advance past
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('/', TokenType.BinOp));
					} else if (src[0] == 'u' && src[1] == 's') {
						// "sus" (if) statement found, advance past
						src.shift();
						src.shift();

						tokens.push(token('if', TokenType.If));
					} else {
						src.unshift(firstCharS);
						tokens = handleSymbols(src, tokens);
					}

					break;

				case 'w':
					let firstCharW = src.shift()!; // advance past first character
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
					} else {
						src.unshift(firstCharW);
						tokens = handleSymbols(src, tokens);
					}

					break;

				case 'y':
					const firstCharY = src.shift()!; // advance past first character

					if (src[0] == 'a' && src[1] == 'l' && src[2] == 'l') {
						// "yall" (for) loop found, advance past "all" token remainder
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('for', TokenType.For));
					} else if (
						src[0] == 'o' &&
						src[1] == 'i' &&
						src[2] == 'n' &&
						src[3] == 'k'
					) {
						// "yoink" (import) statement found, advance past "oink" token remainder
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('import', TokenType.Import));
					} else if (
						src[0] == 'e' &&
						src[1] == 'e' &&
						src[2] == 't'
					) {
						// "yeet" (export) statement found, advance past
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('export', TokenType.Export));
					} else {
						src.unshift(firstCharY);
						tokens = handleSymbols(src, tokens);
					}

					break;

				// look for strings
				case '"':
					let str = '';
					src.shift(); // advance past opening quotes (begin string)

					while (src.length > 0 && src[0] !== '"') {
						str += src.shift()!;
					}

					src.shift(); // advance past closing quotes (end string)

					tokens.push(token(str, TokenType.String));

					break;

				default:
					if (isAlpha(curr, false)) {
						tokens = handleSymbols(src, tokens);
					} else if (isSkippable(src[0])) {
						// ignore whitespace
						src.shift();
					} else {
						// handle unknown
						// TODO: implement error handling and recovery
						throw `GSXError: LexerError: Unknown character: UNICODE-${src[0].charCodeAt(
							0
						)} ${src[0]}`;
					}

					break;
			}
		}
	}

	tokens.push({ value: 'EOF', type: TokenType.EOF });

	// console.log(tokens);

	return tokens;
}

function handleSymbols(src: string[], tokens: Token[]): Token[] {
	// first char of ident can be [a-zA-Z] or underscore
	let ident = '';
	ident += src.shift();

	while (src.length > 0 && isAlpha(src[0], false)) {
		ident += src.shift();
	}

	// user/natively defined symbols should only be reaching this point
	tokens.push(token(ident, TokenType.Identifier));

	// return new tokens array
	return tokens;
}
