import { Token, TokenPos } from '../types';

export function tokenize(source: string): Token[] {
	const tokens: Token[] = new Array<Token>();
	const src: string[] = source.split('');

	let currPos: TokenPos['Start'] = { Line: 1, Column: 0 };

	while (src.length > 0) {
		const currentToken: string = src[0];
		// const token: Token | undefined =
	}

	return tokens;
}
