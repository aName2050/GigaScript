import { SpecialError } from '../../typescript/Error.types';
import { NodeType, Token, TSError } from '../../typescript/GS.types';
import { Tokens } from '../lexer/tokens';
import { Node } from '../parser/nodes';

export function getErrorLocation(token: Token): string {
	return `${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`;
}

export function getNodeTypeStringName(
	type: Token['type'],
	group: string
): string {
	for (const nodeGroup in Node) {
		if (nodeGroup == group) {
			for (const node in Node[nodeGroup as NodeType]) {
				if (isNaN(Number(node))) continue;
				if ((Number(node) as number) == type)
					return Node[nodeGroup as NodeType][node] as string;
			}
		}
	}

	throw new TSError(
		SpecialError.InternalError,
		'Invalid node type and group'
	);
}

// export function getTokenByEnum(
// 	type: Token['id'],
// 	group: string
// ): string {
// 	for (const tokenGroup in Tokens) {
// 		if (tokenGroup == group) {
// 			for (const node in Node[nodeGroup as NodeType]) {
// 				if (isNaN(Number(node))) continue;
// 				if ((Number(node) as number) == type)
// 					return Node[nodeGroup as NodeType][node] as string;
// 			}
// 		}
// 	}

// 	throw new TSError(
// 		SpecialError.InternalError,
// 		'Invalid node type and group'
// 	);
// }
