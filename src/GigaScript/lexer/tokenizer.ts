import { Token } from '../../types/token';

export function tokenize(source: string): Token[] {
	const tokens: Array<Token> = new Array<Token>();
	const src = source.split('');

	let currentPosition: { Line: number; Column: number } = {
		Line: 1,
		Column: 1,
	};
}
