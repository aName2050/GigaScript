import { isAlpha, isInt, isSkippable, token } from '../lexer/lexerUtil';
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

export function readGSX(source: string): Token[] {
	const tokens = new Array<Token>();
	const src = source.split('');

	// Make tokens till EOF
	while (src.length > 0) {
		const curr = src[0];
		const TOKEN = TOKENS[curr];

		console.log(`"${curr}"`, 'token?', TokenType[TOKEN]);

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
				case 'b':
					const firstCharB = src.shift()!; // advance past first character
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
					} else if (src[0] == 'r' && src[1] == 'o') {
						// "bro" ("const") token found, advance past
						src.shift();
						src.shift();

						tokens.push(token('const', TokenType.Const));
					} else if (
						src[0] == 'r' &&
						src[1] == 'u' &&
						src[2] == 'h'
					) {
						// "bruh" ("func") found, advance past token
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('func', TokenType.Func));
					} else {
						src.unshift(firstCharB);
					}

					break;

				case 'c':
					const firstCharC = src.shift()!; // advance past first character
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
					} else {
						src.unshift(firstCharC);
					}

					break;

				case 'f':
					const firstCharF = src.shift()!; // advance past first character
					if (src[0] == 'r' && src[1] == 'f' && src[2] == 'r') {
						// "frfr" comparison token found, advance past "rfr" token remainder
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('==', TokenType.IsEqual));
					} else if (
						src[0] == 'a' &&
						src[1] == 'k' &&
						src[2] == 'e'
					) {
						// "fake" symbol found (null), advance past
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('null', TokenType.Identifier));
					} else if (
						src[1] == 'i' &&
						src[2] == 'n' &&
						src[3] == 'd' &&
						src[4] == 'O' &&
						src[5] == 'u' &&
						src[6] == 't'
					) {
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('catch', TokenType.Identifier));
					} else {
						src.unshift(firstCharF);
					}

					break;

				case 'i':
					const firstCharI = src.shift()!; // advance past first character
					if (src[0] == 's') {
						// "is" token found (:), advance past
						src.shift();

						tokens.push(token(':', TokenType.Colon));
					} else if (
						src[0] == 'm' &&
						src[1] == 'p' &&
						src[2] == 'o' &&
						src[3] == 's' &&
						src[4] == 't' &&
						src[5] == 'e' &&
						src[6] == 'r'
					) {
						// "imposter" (else) statement found, advance past
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('else', TokenType.Else));
					} else {
						src.unshift(firstCharI);
					}

					break;

				case 'l':
					const firstCharL = src.shift()!; // advance past first token
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
					} else if (src[0] == 'i' && src[1] == 't') {
						// "lit" ("let") variable declaration found, advance past token
						src.shift();
						src.shift();

						tokens.push(token('let', TokenType.Let));
					} else {
						src.unshift(firstCharL);
					}

					break;

				case 'm':
					const firstCharM = src.shift()!;
					if (
						src[1] == 'e' &&
						src[2] == 's' &&
						src[3] == 's' &&
						src[4] == 'A' &&
						src[5] == 'r' &&
						src[6] == 'o' &&
						src[7] == 'u' &&
						src[8] == 'n' &&
						src[9] == 'd'
					) {
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('try', TokenType.Identifier));
					} else {
						src.unshift(firstCharM);
					}

					break;

				case 'n':
					const firstCharN = src.shift()!; // advance past first character
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
					} else if (
						src[1] == 'e' &&
						src[2] == 'r' &&
						src[3] == 'd'
					) {
						src.shift();
						src.shift();
						src.shift();

						tokens.push(token('math', TokenType.Identifier));
					} else {
						src.unshift(firstCharN);
					}

					break;

				case 'r':
					const firstCharR = src.shift()!; // advance past first character
					if (src[0] == 'n') {
						// "rn" token found, advance past
						src.shift();

						tokens.push(token(';', TokenType.Semicolon));
					} else {
						src.unshift(firstCharR);
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
					} else {
						src.unshift(firstCharY);
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
						// first char of ident can be [a-zA-Z] or underscore
						let ident = '';
						ident += src.shift();

						while (src.length > 0 && isAlpha(src[0], false)) {
							ident += src.shift();
						}

						console.log(ident, ' => ', TokenType[TOKENS[ident]]);

						// user/natively defined symbols should only be reaching this point
						tokens.push(token(ident, TokenType.Identifier));
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

		console.log('newToken', tokens[tokens.length - 1]);
	}

	tokens.push({ value: 'EOF', type: TokenType.EOF });

	// console.log(tokens);

	return tokens;
}
