import { Program, STATEMENT, EXPRESSION } from '../ast/ast';
import { AssignmentExpr, UnaryExpr } from '../ast/assignments.ast';
import { BinaryExpr } from '../ast/binop.ast';
import { VarDeclaration, FuncDeclaration } from '../ast/declarations.ast';
import {
	Identifier,
	Literal,
	ArrayLiteral,
	NumberLiteral,
	ObjectLiteral,
	StringLiteral,
	Property,
} from '../ast/literals.ast';
import { tokenize } from '../lexer/tokenizer';
import { Token, TokenID } from '../tokens';
import { NodeType } from '../nodes';

/**
 * Parse token list into an AST
 */
export default class Parser {
	private tokens: Token[] = [];

	/**
	 * Check for <EndOfFile> token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type != NodeType.__EOF__;
	}

	/**
	 *
	 * @returns Returns the current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 * Returns the current token and then shifts the array to the next token
	 */
	private eat(): Token {
		const p = this.tokens.shift() as Token;
		return p;
	}

	/**
	 * Checks the current token NodeType to the expected NodeType shifts array to next token.
	 * If NodeType is not of the expected type, an error will be thrown.
	 *
	 * @returns The current token
	 */
	private expect(type: NodeType, errMsg: string): Token {
		const p = this.tokens.shift() as Token;
		if (!p || p.type != type) {
			console.error(`ParseError: ${errMsg}`);
			console.error(
				`Expected NodeType{${type}}, instead got NodeType{${p.type}}`
			);
			process.exit(1);
		}

		return p;
	}

	private generateAST(source: string): Program {
		this.tokens = tokenize(source);
		const program: Program = {
			kind: 'Program',
			body: [],
		};

		// Parse unti end of file
		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		return program;
	}

	private parseStatement(): STATEMENT {
		// TODO: implement parsing
		return { kind: 'Program', body: [] } as Program; // *temp line to silence errors*
	}
}
