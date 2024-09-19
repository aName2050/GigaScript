import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError, NodeType, Token } from '../../typescript/GS.types';
import { EXPRESSION, Program, STATEMENT } from '../ast/ast';
import {
	Identifer,
	NumberLiteral,
	StringLiteral,
} from '../ast/literals/literals.ast';
import { tokenize } from '../lexer/tokenizer';
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

	public get Tokens(): Token[] {
		return this.tokens;
	}

	public tokenizeSourceFile(src: string): void {
		this.tokens = tokenize(src);
	}

	public generateAST(): Program {
		const program: Program = {
			kind: 'Program',
			body: [],
			start: {
				Line: 1,
				Column: 1,
			},
			end: {
				Line: 1,
				Column: 1,
			},
		};

		while (!this.isEOF()) {
			program.body.push(this.parseStatement());
		}

		const EOFToken = this.current();
		if (EOFToken.type != Node.Special.__EOF__)
			throw new GSError(
				SpecialError.ParseError,
				'<EOF> (End of File) token not found. File may be corrupt.',
				`${SOURCE_FILE}:${getErrorLocation(this.current())}`
			);

		program.end = {
			Line: EOFToken.__GSC._POS.end.Line!,
			Column: EOFToken.__GSC._POS.end.Column!,
		};

		return program;
	}

	// [STATEMENTS]
	private parseStatement(): STATEMENT {
		// switch (this.current().type) {
		// 	// case Node.Keyword.Var:
		// 	// case Node.Keyword.Const:
		// 	// 	// return this.parseVariableDeclaration();
		// 	// 	break;
		// 	default:
		// 		return this.parseExpr();
		// }
		return this.parseExpr();
	}

	// [EXPRESSIONS]
	private parseExpr(): EXPRESSION {
		return this.parsePrimaryExpression();
	}

	// Fall back to primary expression parsing
	private parsePrimaryExpression(): EXPRESSION {
		const token = this.current();
		console.log(token);

		switch (token.type) {
			case Node.Literal.IDENTIFIER:
				return {
					kind: 'Identifier',
					symbol: this.advance().value,
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as Identifer;

			case Node.Literal.NUMBER:
				return {
					kind: 'NumberLiteral',
					value: parseFloat(this.advance().value),
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as NumberLiteral;

			case Node.Literal.STRING:
				return {
					kind: 'StringLiteral',
					value: this.advance().value,
					start: {
						Line: token.__GSC._POS.start.Line,
						Column: token.__GSC._POS.start.Column,
					},
					end: {
						Line: token.__GSC._POS.end.Line,
						Column: token.__GSC._POS.end.Column,
					},
				} as StringLiteral;

			case Node.Group.OpenParen:
				this.advance();
				const value = this.parseExpr();
				this.expect(Node.Group.CloseParen, 'Group');

				return value;

			default:
				throw new GSError(
					SpecialError.ParseError,
					`Unexpected token " + ${getNodeTypeStringName(
						token.type,
						token.nodeGroup
					)}"`,
					`${SOURCE_FILE}:${getErrorLocation(token)}`
				);
		}
	}
}
