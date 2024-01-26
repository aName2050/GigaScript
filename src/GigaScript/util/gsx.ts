import { isAlpha, isInt, isSkippable, token } from '../lexer/lexerUtil';
import { Token, TokenType } from '../types';

const CHARS: Record<string, string> = {
	// TOKENS
	lit: 'let',
	bro: 'const',

	bruh: 'func',

	sus: 'if',
	impostor: 'else',

	yall: 'for',

	yoink: 'import',

	big: '>',
	lil: '<',
	frfr: '==',
	nah: '!=',
	btw: '&&',
	carenot: '||',

	with: '+',
	without: '-',
	by: '*',
	some: '/',
	left: '%',

	be: '=',

	rn: ';',
	is: ':',

	// SPECIAL
	nocap: 'true',
	cap: 'false',
	fake: 'null',

	messAround: 'try',
	findOut: 'catch',

	waffle: 'print',
	nerd: 'math',
};

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

	with: TokenType.BinOp,
	without: TokenType.BinOp,
	by: TokenType.BinOp,
	some: TokenType.BinOp,
	left: TokenType.BinOp,

	rn: TokenType.Semicolon,
	is: TokenType.Colon,
	',': TokenType.Comma,
	'.': TokenType.Dot,

	lil: TokenType.LessThan,
	big: TokenType.GreaterThan,
};

// typescript stuff :(
declare global {
	interface String {
		replaceGSX(target: string): string;
	}
}

// test: ("(.*?)")
// replace gsx from source
// String.prototype.replaceGSX = function (target: string): string {
// 	const regex = new RegExp('(?<!["s])\\b' + target + '\\b(?!["])', 'g');
// 	console.log(target, CHARS[target]);

// 	return this.replace(regex, CHARS[target]);
// };

export function readGSX(source: string): Token[] {
	const tokens = new Array<Token>();
	const src = source.split('');

	// Make tokens till EOF
	while (src.length > 0) {
		const curr = src[0];
		const TOKEN = TOKENS[curr];

		console.log(curr);

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
			src.shift();
		}

		// } else if (typeof TOKEN == 'number') {
		// 	// Matches a single character token in TOKENS
		// 	tokens.push(token(src.shift(), TOKEN));
		// } else {
		// 	// handle multicharacter tokens and special tokens
		// 	switch (curr) {
		// 		// handle tokens that can be in a single character or multicharacter form
		// 		case '=':
		// 			src.shift(); // go past first equals to check if there is another
		// 			if (src[0] == '=') {
		// 				src.shift(); // ISEQUAL comparison found
		// 				tokens.push(token('==', TokenType.IsEqual));
		// 			} else {
		// 				tokens.push(token('=', TokenType.Equals));
		// 			}
		// 			break;

		// 		case '&':
		// 			src.shift(); // go past first & and check for second one
		// 			if (src[0] == '&') {
		// 				src.shift(); // AND comparison found
		// 				tokens.push(token('&&', TokenType.And));
		// 			} else {
		// 				tokens.push(token('&', TokenType.Ampersand));
		// 			}
		// 			break;

		// 		case '|':
		// 			src.shift(); // go past first | and check for second one
		// 			if (src[0] == '|') {
		// 				src.shift(); // OR comparison found
		// 				tokens.push(token('||', TokenType.Or));
		// 			} else {
		// 				tokens.push(token('|', TokenType.Bar));
		// 			}
		// 			break;

		// 		case '!':
		// 			src.shift(); // go past ! to check for equals sign
		// 			if (src[0] == '=') {
		// 				src.shift(); // NOTEQUAL comparison found
		// 				tokens.push(token('!=', TokenType.NotEquals));
		// 			} else {
		// 				tokens.push(token('!', TokenType.Exclamation));
		// 			}
		// 			break;

		// 		case '"': // string support
		// 			let str = '';
		// 			src.shift(); // move past opening doubleQuotes, indicating beginning of string

		// 			while (src.length > 0 && src[0] !== '"') {
		// 				str += src.shift();
		// 			}

		// 			src.shift(); // advance past closing doubleQuotes, indicating end of string

		// 			tokens.push(token(str, TokenType.String));
		// 			break;

		// 		default:
		// 			if (isAlpha(curr, false)) {
		// 				// The first character of an identifier can be alphabetic or an underscore
		// 				let ident = '';
		// 				ident += src.shift();

		// 				while (src.length > 0 && isAlpha(src[0])) {
		// 					// Identifier can consist of alphanumeric or underscores after first character
		// 					ident += src.shift();
		// 				}

		// 				// check for reserved keywords
		// 				const RESERVED = KEYWORDS[ident];
		// 				if (typeof RESERVED == 'number') {
		// 					tokens.push(token(ident, RESERVED));
		// 				} else {
		// 					// Unknown identifier most likely means user defined symbol
		// 					tokens.push(token(ident, TokenType.Identifier));
		// 				}
		// 			} else if (isSkippable(src[0])) {
		// 				// ignore whitespace characters
		// 				src.shift();
		// 			} else {
		// 				// handle unknown characters
		// 				// TODO: implement error handling and recovery

		// 				console.error(
		// 					`LexerError: Unknown character: UNICODE-${src[0].charCodeAt(
		// 						0
		// 					)} ${src[0]}`
		// 				);
		// 				process.exit(1);
		// 			}
		// 			break;
		// 	}
		// }
	}

	tokens.push({ value: 'EOF', type: TokenType.EOF });

	console.log(tokens);

	return tokens;
}
