import { SOURCE_FILE } from '../..';
import { Token } from '../../types/token';
import { NodeType } from '../../types/token.node';
import { GigaScriptError } from '../../util/GSError';
import {
	EXPRESSION,
	Program,
	STATEMENT,
} from '../abstract_syntax_tree/base.ast';
import { VariableDeclaration } from '../abstract_syntax_tree/declarations.ast';
import {
	Identifier,
	NumberLiteral,
} from '../abstract_syntax_tree/literals.ast';
import { tokenize } from '../lexer/tokenizer';

export default class Parser {
	private tokens: Array<Token> = [];

	/**
	 * Checks if the current token is not the end-of-file token
	 * @returns Whether the current token is not the end-of-file token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type !== NodeType.__EOF__;
	}

	/**
	 * Peeks at the token at the specified offset
	 * @param offset The offset to peek at (default: 0)
	 * @returns The token at the specified offset
	 */
	private peek(offset = 0): Token {
		return this.tokens[offset];
	}

	/**
	 * Advances the token stream by one and returns the next token
	 * @returns The next token in the stream
	 */
	private advance(): Token {
		return this.tokens.shift()!;
	}

	/**
	 * Expects the next token to be of a certain type and advances the stream if it is, otherwise throws an error
	 * @param type The expected token type
	 * @returns The next token in the stream if it is of the expected type
	 * @throws Error if the next token is not of the expected type
	 */
	private expect(type: NodeType): Token {
		const token = this.peek();
		if (token.type !== type) {
			throw new GigaScriptError(
				'ParseError',
				`Expected token of type ${NodeType[type]}, but got ${NodeType[token.type]}`,
				`${SOURCE_FILE}:${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`,
			);
		}
		return this.advance();
	}

	public set Tokens(tokens: Array<Token>) {
		this.tokens = tokens;
	}

	public get Tokens(): Array<Token> {
		return this.tokens;
	}

	public tokenizeSource(src: string): void {
		this.tokens = tokenize(src);

		for (let i = 0; i < this.tokens.length; i++) {
			const token = this.tokens[i];
			if (
				token.__GSC._POS.start.Line === null ||
				token.__GSC._POS.start.Column === null ||
				token.__GSC._POS.end.Line === null ||
				token.__GSC._POS.end.Column === null
			) {
				throw new GigaScriptError(
					'TokenizationError',
					`Token ${token.value} is missing position information`,
					`${SOURCE_FILE}:${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`,
				);
			}
		}
	}

	public generateAbstractSyntaxTree(): Program {
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

		if (this.peek().type !== NodeType.__SOF__) {
			throw new GigaScriptError(
				'ParseError',
				`Expected start of file token, but got ${NodeType[this.peek().type]}`,
				`${SOURCE_FILE}:${this.peek().__GSC._POS.start.Line}:${this.peek().__GSC._POS.start.Column}`,
			);
		}

		this.advance();

		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		if (this.peek().type !== NodeType.__EOF__) {
			throw new GigaScriptError(
				'ParseError',
				`Expected end of file token, but got ${NodeType[this.peek().type]}`,
				`${SOURCE_FILE}:${this.peek().__GSC._POS.start.Line}:${this.peek().__GSC._POS.start.Column}`,
			);
		}

		program.end = {
			Line: this.advance().__GSC._POS.end.Line!,
			Column: this.advance().__GSC._POS.end.Column!,
		};

		console.log(program);

		return program;
	}

	private parseStatement(): STATEMENT {
		switch (this.peek().type) {
			case NodeType.Let:
			case NodeType.Const:
				return this.parseVariableDeclaration();
			default:
				throw new GigaScriptError(
					'ParseError',
					`Unexpected token ${NodeType[this.peek().type]}`,
					`${SOURCE_FILE}:${this.peek().__GSC._POS.start.Line}:${this.peek().__GSC._POS.start.Column}`,
				);
		}
	}

	private parseVariableDeclaration(): STATEMENT {
		const position = this.peek().__GSC._POS;
		const isConstant = this.advance().type === NodeType.Const;
		const identifier = this.expect(NodeType.Identifier).value;

		this.expect(NodeType.Equals);

		const initializer = this.parseExpression();

		this.expect(NodeType.Semicolon);

		return {
			kind: 'VariableDeclaration',
			constant: isConstant,
			identifier,
			value: initializer,
			start: position.start,
			end: initializer.end,
		} as VariableDeclaration;
	}

	private parseExpression(): EXPRESSION {
		return this.parsePrimaryExpression();
	}

	private parsePrimaryExpression(): EXPRESSION {
		const token = this.peek();
		console.log(token);

		switch (token.type) {
			case NodeType.Identifier:
				return {
					kind: 'Identifier',
					value: this.advance().value,
					start: token.__GSC._POS.start,
					end: token.__GSC._POS.end,
				} as Identifier;
			case NodeType.Number:
				return {
					kind: 'NumberLiteral',
					value: parseFloat(this.advance().value),
					start: token.__GSC._POS.start,
					end: token.__GSC._POS.end,
				} as NumberLiteral;
			default:
				throw new GigaScriptError(
					'ParseError',
					`Unexpected token ${NodeType[token.type]} in expression`,
					`${SOURCE_FILE}:${token.__GSC._POS.start.Line}:${token.__GSC._POS.start.Column}`,
				);
		}
	}
}
