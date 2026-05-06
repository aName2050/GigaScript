import { Token } from '../types/token';
import { NodeType } from '../types/token.node';
import { TokenPosition } from '../types/token.position';
import { Symbol } from '../types/token.symbol';

/**
 *
 * @param id The ID of the token
 * @param type The type of the token
 * @param value The raw value of the token
 * @param Line Line number the first character of the token was found on
 * @param Column Column number the first character of the token was found on
 * @returns A new token
 */
export function generateToken(
	symbol: Symbol,
	type: NodeType,
	raw: string,
	PositionData: TokenPosition
): Token {
	return {
		symbol,
		type,
		value: raw,
		__GSC: {
			_POS: PositionData,
		},
	} as Token;
}
