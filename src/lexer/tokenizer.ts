import { Token } from '../types';

export function tokenize(source: string): Token[] {
	const tokens: Token[] = new Array<Token>();
	const src: string[] = source.split('');

	return tokens;
}
