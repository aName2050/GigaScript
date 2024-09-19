import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError, NodeType, Token } from '../../typescript/GS.types';
import { getErrorLocation, getNodeTypeStringName } from '../util/parser.util';
import { Node } from './nodes';

export default class Parser {
	private tokens: Token[] = [];

	/**
	 *
	 * @returns Whether the token is an End of File token
	 */
	private isEOF(): boolean {
		return this.tokens[0].type == Node.Special.__EOF__;
	}

	/**
	 *
	 * @returns The current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 *
	 * @returns The next token
	 */
	private next(): Token {
		return this.tokens[1] as Token;
	}

	/**
	 *
	 * @returns The current and shifts token array
	 */
	private advance(): Token {
		return this.tokens.shift() as Token;
	}

	public expect(type: Token['type'], group: NodeType, errNote = ' '): Token {
		const token = this.tokens.shift() as Token;
		if (!token || token.type != type) {
			throw new GSError(
				SpecialError.ParseError,
				`Expected "${getNodeTypeStringName(
					type,
					group
				)}"${errNote}, instead saw token "${getNodeTypeStringName(
					token.type,
					token.nodeGroup
				)}`,
				`${SOURCE_FILE}:${getErrorLocation(token)}`
			);
		}

		return token;
	}
}
