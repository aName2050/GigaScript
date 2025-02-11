import { Token, TokenData } from '../types';

export function createToken(data: TokenData): Token {
	return {
		ID: data.ID,
		_GSC: {
			POS: data.Pos,
		},
	} as Token;
}
