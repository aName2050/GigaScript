import { TokenType } from '../lexer/tokens';
import { GSError, SpecialError, Token } from '../types';

export function formatErrorLocation(token: Token): string {
	return `${token._GSC.Position.Start.Line}:${token._GSC.Position.Start.Column}`;
}

export function getTokenName(id: Token['id']): string {
	for (const token in TokenType) {
		if (isNaN(Number(token))) continue;
		if ((Number(token) as number) == id) return TokenType[id] as string;
	}

	throw new GSError(SpecialError.InternalError, 'Invalid token ID', '');
}
