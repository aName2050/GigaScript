import { TokenType } from '../nodes';
import { Token, TokenID } from '../tokens';

export function setToken(id: TokenID, type: TokenType, value: string): Token {
	return { id, type, value } as Token;
}

// TODO: add "isAlpha", "isInt", "isWhitespace"
