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

type TOKEN_METADATA = Record<string, { value: string; type: TokenType }>;

/**
 * GSX Reserved Keywords
 */
const GSX_KEYWORDS: TOKEN_METADATA = {
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

	'some': { value: '/', type: TokenType.BinOp },
	'sus': { value: 'if', type: TokenType.If },
	'skirt': { value: 'break', type: TokenType.Break },

	'waffle': { value: 'print', type: TokenType.Identifier },
	'with': { value: '+', type: TokenType.BinOp },
	'without': { value: '-', type: TokenType.BinOp },

	'yoink': { value: 'import', type: TokenType.Import },
	'yeet': { value: 'export', type: TokenType.Export },
	'yall': { value: 'for', type: TokenType.For },
};

// TODO: replace with GSX alt
/**
 * Non-GSX Reserved Keywords
 */
const KEYWORDS: TOKEN_METADATA = {
	'continue': { value: 'continue', type: TokenType.Continue },

	'from': { value: 'from', type: TokenType.From },

	'while': { value: 'while', type: TokenType.While },
};

export function tokenizeGSX(source: string): Token[] {
	const tokens = new Array<Token>();
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

	// console.log(tokens);

	return tokens;
}
