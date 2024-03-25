import { sourceFile } from '../..';
import { EXPRESSION, Program, STATEMENT } from '../ast/ast';
import { VarDeclaration } from '../ast/declarations.ast';
import { Identifier, NumberLiteral, StringLiteral } from '../ast/literals.ast';
import { tokenize } from '../lexer/tokenizer';
import { NodeType } from '../nodes';
import { Token, getTokenByTypeEnum } from '../tokens';
import { getErrorLocation } from '../util/getErrLoc';
import { ParseError } from '../util/parseError';

export default class Parser {
	private tokens: Array<Token> = [];

	/**
	 * Check for End of File token
	 */
	private notEOF(): boolean {
		return this.tokens[0].type != NodeType.__EOF__;
	}

	/**
	 * @returns the current token
	 */
	private current(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 * @returns the current token and shifts the token array
	 */
	private advance(): Token {
		return this.tokens.shift() as Token;
	}

	/**
	 * Checks if the current token matches the expected type, and throws an error if it doesn't
	 *
	 * @param errNote Output: Expected "(expectedTokenType)" (errNote), instead saw "(encounteredTokenType)"
	 *
	 * @returns the current token if it matches the expected token
	 */
	private expect(type: NodeType, errNote = ''): Token {
		if (errNote.length > 0) errNote = ' ' + errNote;
		const token = this.tokens.shift() as Token;
		if (!token || token.type != type) {
			console.log(
				new ParseError(
					`Expected "${
						getTokenByTypeEnum(type)?.value
					}"${errNote}, instead saw "${token.value}"`,
					`${sourceFile}:${getErrorLocation(token)}`
				)
			);
			process.exit(1);
		}

		return token;
	}

	public get Tokens(): Array<Token> {
		return this.tokens;
	}

	public tokenizeSource(src: string): void {
		this.tokens = tokenize(src);
	}

	public generateAST(): Program {
		const program: Program = {
			kind: 'Program',
			body: [],
			start: {
				Line: 1,
				Column: 0,
			},
			end: {
				Line: 1,
				Column: 0,
			},
		};

		while (this.notEOF()) {
			// program.body.push(this.parseStatement());
		}

		// program.end = { Line: program.body[program.body.length - 1] }

		console.log(program.body[program.body.length - 1]);

		return program;
	}

	// [STATEMENTS]
	// private parseStatement(): STATEMENT {
	// 	switch (this.current().type) {
	// 		case NodeType.Let:
	// 		case NodeType.Const:
	// 			return this.parseVarDeclaration();

	// 		default:
	// 			return this.parseExpr();
	// 	}
	// }

	// private parseCodeBlock(): Array<STATEMENT> {
	// 	this.expect(NodeType.OpenBrace, 'at start of code block');

	// 	const body: Array<STATEMENT> = [];

	// 	while (this.notEOF() && this.current().type !== NodeType.CloseBrace) {
	// 		const stmt = this.parseStatement();
	// 		body.push(stmt);
	// 	}

	// 	this.expect(NodeType.CloseBrace, 'at end of code block');

	// 	return body;
	// }

	// // [STATEMENTS.DECLARATIONS]

	// private parseVarDeclaration(): STATEMENT {
	// 	const isConstant = this.advance().type == NodeType.Const;
	// 	const identifier = this.expect(
	// 		NodeType.Identifier,
	// 		`following ${isConstant ? 'const' : 'let'} keyword`
	// 	).value;

	// 	if (this.current().type == NodeType.Semicolon) {
	// 		this.advance();
	// 		if (isConstant) {
	// 			console.log(
	// 				new ParseError(
	// 					'Constant variables must be delcared with a value',
	// 					`${sourceFile}:${getErrorLocation(this.current())}`
	// 				)
	// 			);
	// 			process.exit(1);
	// 		}

	// 		return {
	// 			kind: 'VarDeclaration',
	// 			constant: false,
	// 			identifier,
	// 		} as VarDeclaration;
	// 	}

	// 	this.expect(NodeType.Equals, 'following variable identifier');

	// 	const declaration = {
	// 		kind: 'VarDeclaration',
	// 		value: this.parseExpr(),
	// 		identifier,
	// 		constant: isConstant,
	// 	} as VarDeclaration;

	// 	this.expect(NodeType.Semicolon, 'following variable declaration');

	// 	return declaration;
	// }

	// // [EXPRESSIONS]
	// private parseExpr(): EXPRESSION {
	// 	return this.parsePrimaryExpression();
	// }

	// private parsePrimaryExpression(): EXPRESSION {
	// 	const token = this.current();

	// 	switch (token.type) {
	// 		case NodeType.Identifier:
	// 			return {
	// 				kind: 'Identifier',
	// 				symbol: this.advance().value,
	// 				start: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 				end: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 			} as Identifier;

	// 		case NodeType.Number:
	// 			return {
	// 				kind: 'NumberLiteral',
	// 				value: parseFloat(this.advance().value),
	// 				start: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 				end: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 			} as NumberLiteral;

	// 		case NodeType.String:
	// 			return {
	// 				kind: 'StringLiteral',
	// 				value: this.advance().value,
	// 				start: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 				end: {
	// 					Line: token.__GSC._POS.Line,
	// 					Column: token.__GSC._POS.Column,
	// 				},
	// 			} as StringLiteral;

	// 		case NodeType.OpenParen:
	// 			this.advance();
	// 			const value = this.parseExpr();
	// 			this.expect(NodeType.CloseParen);

	// 			return value;

	// 		default:
	// 			console.log(
	// 				new ParseError(
	// 					`Uncaught: Unexpected token "${this.current().type}"`,
	// 					`${sourceFile || 'GSREPL'}:${
	// 						this.current().__GSC._POS.Line
	// 					}:${this.current().__GSC._POS.Column}`
	// 				)
	// 			);
	// 			process.exit(1);
	// 	}
	// }
}
