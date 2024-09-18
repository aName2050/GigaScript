import { NodeType, Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

export function getErrorLocation(token: Token): string {
	return `${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`;
}

export function getNodeTypeStringName(type: Token['type']): string {
	for (const nodeType in Node) {
		// console.log(Node[nodeType as NodeType]);
		for (const node in Node[nodeType as NodeType]) {
			console.log(type);
		}
	}

	return '';
}
