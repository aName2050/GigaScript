import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export namespace TokenID {
	export enum Literal {}

	export enum Keyword {}

	export enum Operation {}

	export enum Symbol {}

	export enum AssignmentOperator {}

	export enum ComparisonOperator {}

	export enum UnaryOperator {}

	export enum LogicalOperator {}

	export enum BitwiseOperator {}

	export enum Group {}

	export enum Special {}
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: Token['id'],
	type: Token['type'],
	value: string
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: {
			_POS: {
				start: {
					Line: null,
					Column: null,
				},
				end: {
					Line: null,
					Column: null,
				},
			},
			_LENGTH: null,
		},
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

export { Tokens };
