import { isAlpha, isInt, isSkippable, token } from '../lexer/lexerUtil';
import { Token, TokenType } from '../types';

const CHARS: Record<string, string> = {
	// Comparisons
	big: '>',
	lil: '<',
	frfr: '==',
	nah: '!=',
	btw: '&&',
	carenot: '||',

	// BinOp
	with: '+',
	without: '-',
	by: '*',
	some: '/',
	left: '%',

	// Assignments
	be: '=',

	// Special Tokens
	rn: ';',
	is: ':',

	// Native
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
			// multicharacter tokens + special tokens
			switch (curr) {
				// look for "=" ("be")
				case 'b':
					src.shift(); // advance past first character
					if (src[0] == 'e') {
						src.shift(); // "be" assignment token
						tokens.push(token('=', TokenType.Equals));
					}
					break;

				// look for "==" ("frfr")
				case 'f':
					src.shift(); // advance past first character
					if (src[0] == 'r' && src[1] == 'f' && src[2] == 'r') {
						// "frfr" comparison token found, advance past "rfr" token remainder
						src.shift();
						src.shift();
						src.shift();
						tokens.push(token('==', TokenType.IsEqual));
					}
					break;
			}
		}
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
