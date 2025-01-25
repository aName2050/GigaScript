import { Token } from '../tokens';

/**
 *
 * @returns "line:column"
 */
export function getErrorLocation(token: Token): string {
	return `${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`;
}
