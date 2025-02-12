import { Token, TokenData } from '../types';
import { Tokens } from './tokens';

export function createToken(data: TokenData): Token {
	return {
		ID: data.ID,
		_GSC: {
			POS: data.Pos,
		},
	} as Token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

// export function setTokenData
