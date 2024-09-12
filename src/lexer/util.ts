import { Node } from '../parser/nodes';
import { Token } from '../../typescript/GS.types';

export function createToken(
	id: Token['id'],
	type: Token['type'],
	value: string,
	position: Token['__GSC']['_POS']
): Token {
	return {
		id,
		type,
		value,
		__GSC: {
			_POS: position,
		},
	} as Token;
}
