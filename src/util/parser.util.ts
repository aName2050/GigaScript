import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

export function getErrorLocation(token: Token): string {
	return `${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`;
}

export function getNodeTypeStringName(type: Token['type']): string {
	for (const type in Node) {
		console.log(type);
	}

	return '';
}
