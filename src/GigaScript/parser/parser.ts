import { sourceFile } from '../..';
import { AssignmentExpr } from '../ast/assignments.ast';
import {
	CodeBlockNode,
	EXPRESSION,
	EndOfFileNode,
	Program,
	STATEMENT,
} from '../ast/ast';
import { BinaryExpr } from '../ast/binop.ast';
import {
	ClassDeclaration,
	ClassMethod,
	ClassNewInstanceExpr,
	ClassProperty,
	ConstructorStatement,
} from '../ast/class.ast';
import { IfStatement } from '../ast/conditionals.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../ast/declarations.ast';
import { CallExpr, MemberExpr } from '../ast/expressions.ast';
import {
	ArrayLiteral,
	Identifier,
	NumberLiteral,
	ObjectLiteral,
	Property,
	StringLiteral,
} from '../ast/literals.ast';
import { ExportStatement, ImportStatement } from '../ast/module.ast';
import {
	ReturnStatement,
	ThrowStatement,
	TryCatchStatement,
} from '../ast/statements.ast';
import { tokenize } from '../lexer/tokenizer';
import { NodeType } from '../nodes';
import { Token, getTokenByTypeEnum } from '../tokens';
import { ClassBody } from '../types';
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
	 *
	 * @returns the next token
	 */
	private next(): Token {
		return this.tokens[1] as Token;
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
				Column: 1,
			},
			end: {
				Line: 1,
				Column: 1,
			},
		};

		while (this.notEOF()) {
			program.body.push(this.parseStatement());
		}

		const EOFToken = this.current();

		if (EOFToken.type != NodeType.__EOF__) {
			console.log(
				new ParseError(
					'Uncaught: Missing EndOfFile <EOF> token',
					`${sourceFile}:${getErrorLocation(this.current())}`
				)
			);
			process.exit(1);
		}

		program.end = {
			Line: EOFToken.__GSC._POS.end.Line!,
			Column: EOFToken.__GSC._POS.end.Column!,
		};

		return program;
	}

	// [STATEMENTS]
	private parseStatement(): STATEMENT {
		switch (this.current().type) {
			case NodeType.Let:
			case NodeType.Const:
				return this.parseVariableDeclaration();

			case NodeType.Func:
				return this.parseFunctionDeclaration();
			case NodeType.Return:
				return this.parseReturnStatement();

			case NodeType.Import:
				return this.parseImportStatement();
			case NodeType.Export:
				return this.parseExportStatement();

			case NodeType.Class:
				return this.parseClassDeclaration();

			case NodeType.If:
				return this.parseIfStatement();

			case NodeType.Throw:
				return this.parseThrowStatement();

			default:
				return this.parseExpr();
		}
	}

	private parseCodeBlock(): CodeBlockNode {
		const openBracePos = this.expect(
			NodeType.OpenBrace,
			'at start of code block'
		).__GSC._POS;

		const body: CodeBlockNode = {
			kind: 'CodeBlockNode',
			body: [],
			start: {
				Line: openBracePos.start.Line!,
				Column: openBracePos.start.Column!,
			},
			end: {
				Line: openBracePos.end.Line!,
				Column: openBracePos.end.Column!,
			},
		};

		while (this.notEOF() && this.current().type !== NodeType.CloseBrace) {
			const stmt = this.parseStatement();
			body.body.push(stmt);
		}

		const closeBracePos = this.expect(
			NodeType.CloseBrace,
			'at end of code block'
		).__GSC._POS;

		body.end = {
			Line: closeBracePos.end.Line!,
			Column: closeBracePos.end.Column!,
		};

		return body;
	}

	// [STATEMENTS.DECLARATIONS]

	private parseVariableDeclaration(): STATEMENT {
		const varDecTokenPos = this.current().__GSC._POS;
		const isConstant = this.advance().type == NodeType.Const;
		const identifier = this.expect(
			NodeType.Identifier,
			`following ${isConstant ? 'const' : 'let'} keyword`
		).value;

		if (this.current().type == NodeType.Semicolon) {
			const semicolonPosData = this.advance().__GSC._POS;
			if (isConstant) {
				console.log(
					new ParseError(
						'Constant variables must be delcared with a value',
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
				process.exit(1);
			}

			return {
				kind: 'VariableDeclaration',
				constant: false,
				identifier,
				start: varDecTokenPos.start,
				end: semicolonPosData.end,
			} as VariableDeclaration;
		}

		this.expect(NodeType.Equals, 'following variable identifier');

		const declaration = {
			kind: 'VariableDeclaration',
			value: this.parseExpr(),
			identifier,
			constant: isConstant,
			start: varDecTokenPos.start,
			end: this.next().__GSC._POS.end,
		} as VariableDeclaration;

		this.expect(NodeType.Semicolon, 'following variable declaration');

		return declaration;
	}

	private parseFunctionDeclaration(): STATEMENT {
		const funcTokenPos = this.advance().__GSC._POS;

		const name = this.expect(
			NodeType.Identifier,
			'following "func" keyword'
		).value;

		const args = this.parseArgs();
		const params: Array<string> = [];

		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				console.log(
					new ParseError(
						'Expected arguments to be identifiers',
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
				process.exit(1);
			}

			params.push((arg as Identifier).symbol);
		}

		const body = this.parseCodeBlock();

		const func = {
			kind: 'FunctionDeclaration',
			name,
			body,
			parameters: params,
			start: funcTokenPos.start,
			end: body.end,
		} as FunctionDeclaration;

		return func;
	}

	// [FUNCTIONS.ARGUMENTS/PARAMETERS]
	private parseArgs(): Array<EXPRESSION> {
		this.expect(NodeType.OpenParen, 'before parameter list');

		const args =
			this.current().type == NodeType.CloseParen
				? []
				: this.parseArgumentsList();

		this.expect(NodeType.CloseParen, 'after parameters list');

		return args;
	}

	private parseArgumentsList(): Array<EXPRESSION> {
		const args = [this.parseExpr()];

		while (this.current().type == NodeType.Comma && this.advance()) {
			args.push(this.parseExpr());
		}

		return args;
	}

	private parseReturnStatement(): STATEMENT {
		const returnTokenPos = this.advance().__GSC._POS;

		const value = this.parseExpr();

		const semicolonTokenPos = this.expect(
			NodeType.Semicolon,
			'following return statement'
		).__GSC._POS;

		return {
			kind: 'ReturnStatement',
			value,
			start: returnTokenPos.start,
			end: semicolonTokenPos.end,
		} as ReturnStatement;
	}

	private parseThrowStatement(): STATEMENT {
		const throwTokenPos = this.advance().__GSC._POS;
		const message = this.parseExpr();

		return {
			kind: 'ThrowStatement',
			message,
			start: throwTokenPos.start,
			end: message.end,
		} as ThrowStatement;
	}

	private parseImportStatement(): STATEMENT {
		const importTokenPos = this.advance().__GSC._POS;

		this.expect(NodeType.OpenBrace, 'following import keyword');

		/**
		 * <ExportOriginalIdentifer, AliasIdentifier>
		 */
		const imports = new Map<string, string>();

		while (this.notEOF() && this.current().type != NodeType.CloseBrace) {
			if (this.current().type == NodeType.Identifier) {
				if (this.next().type == NodeType.As) {
					// this advances past the Identifier (checked with this.current()),
					// then advances past the "as" keyword (checked with this.next()),
					// then advances past the alias Identifer

					const exportedIdent = this.advance().value;
					this.advance(); // advance past "as"
					const aliasIdent = this.expect(
						NodeType.Identifier,
						'following "as" keyword'
					).value;
					imports.set(exportedIdent, aliasIdent);
				} else {
					const exportedIdent = this.advance().value;
					imports.set(exportedIdent, exportedIdent);
				}
			} else if (this.current().type == NodeType.Comma) this.advance(); // advance past comma
		}

		this.expect(NodeType.CloseBrace, 'following imports');

		this.expect(NodeType.From, 'in import statement');

		const source = this.expect(
			NodeType.String,
			'containing the file to import'
		);

		return {
			kind: 'ImportStatement',
			imports,
			source: source.value,
			start: importTokenPos.start,
			end: source.__GSC._POS.end,
		} as ImportStatement;
	}

	private parseExportStatement(): STATEMENT {
		const exportTokenPos = this.advance().__GSC._POS;

		const value = this.parseStatement();

		return {
			kind: 'ExportStatement',
			value,
			start: exportTokenPos.start,
			end: value.end,
		} as ExportStatement;
	}

	private parseClassDeclaration(): STATEMENT {
		const classTokenPos = this.advance().__GSC._POS;

		const name = this.expect(
			NodeType.Identifier,
			'following class keyword'
		).value;

		this.expect(NodeType.OpenBrace, 'following class identifier');

		const Class = this.parseClassBody();

		const endPos = this.expect(NodeType.CloseBrace, 'following class body')
			.__GSC._POS;

		return {
			kind: 'ClassDeclaration',
			name,
			properties: Class.properties,
			methods: Class.methods,
			constructor: Class.constructor,
			start: classTokenPos.start,
			end: endPos.end,
		} as ClassDeclaration;
	}

	private parseClassBody(): ClassBody {
		const properties: Array<ClassProperty> = new Array<ClassProperty>();
		const methods: Array<ClassMethod> = new Array<ClassMethod>();
		let constructor: ConstructorStatement | undefined = undefined;

		// loop through body of class
		while (this.notEOF() && this.current().type != NodeType.CloseBrace) {
			if (
				this.current().type == NodeType.Public ||
				this.current().type == NodeType.Private
			) {
				const startPos = this.current().__GSC._POS;
				const isPublic = this.advance().type == NodeType.Public;

				let isStatic: boolean = false;
				if (this.current().type == NodeType.Static) {
					this.advance();
					isStatic = true;
				}

				const identifier = this.expect(
					NodeType.Identifier,
					`following ${
						isStatic ? 'static' : isPublic ? 'public' : 'private'
					} keyword`
				).value;

				if (this.current().type == NodeType.Semicolon) {
					// undefined property
					const endPos = this.expect(
						NodeType.Semicolon,
						'following property declaration'
					).__GSC._POS;

					const prop = {
						kind: 'ClassProperty',
						identifier,
						static: isStatic,
						public: isPublic,
						start: startPos.start,
						end: endPos.end,
					} as ClassProperty;

					properties.push(prop);
				} else if (this.current().type == NodeType.Equals) {
					// defined property
					this.advance();

					const value = this.parseExpr();

					const prop = {
						kind: 'ClassProperty',
						identifier,
						public: isPublic,
						static: isStatic,
						value,
						start: startPos.start,
						end: value.end,
					} as ClassProperty;

					this.expect(
						NodeType.Semicolon,
						'following property declarations'
					);

					properties.push(prop);
				} else if (this.current().type == NodeType.OpenParen) {
					// method
					const args = this.parseArgs();
					const params: Array<string> = [];

					for (const arg of args) {
						if (arg.kind !== 'Identifier') {
							console.log(arg);
							console.log(
								new ParseError(
									'Expected parameter to be of type string',
									`${sourceFile}:${getErrorLocation(
										this.current()
									)}`
								)
							);
							process.exit(1);
						}

						params.push((arg as Identifier).symbol);
					}

					const body: CodeBlockNode = this.parseCodeBlock();

					const method = {
						kind: 'ClassMethod',
						name: identifier,
						public: isPublic,
						params,
						body,
						start: startPos.start,
						end: body.end,
					} as ClassMethod;

					methods.push(method);
				} else {
					console.log(
						new ParseError(
							`Unexpected token following ${
								isStatic
									? 'static'
									: isPublic
									? 'public'
									: 'private'
							} keyword`,
							`${sourceFile}:${getErrorLocation(this.current())}`
						)
					);
					process.exit(1);
				}
			} else if (this.current().type == NodeType.Constructor) {
				constructor =
					this.parseConstructorStatement() as ConstructorStatement;
			} else {
				console.log(
					new ParseError(
						`Expected "public", "private", or "constructor" keywords, instead saw "${
							this.current().value
						}"`,
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
			}
		}

		return {
			constructor,
			properties,
			methods,
		} as ClassBody;
	}

	private parseConstructorStatement(): STATEMENT {
		const constructorTokenPos = this.advance().__GSC._POS;

		const args = this.parseArgs();
		const params: Array<string> = [];

		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				console.log(
					new ParseError(
						'Expected parameter to be of type string',
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
				process.exit(1);
			}

			params.push((arg as Identifier).symbol);
		}

		const body = this.parseCodeBlock();

		return {
			kind: 'ConstructorStatement',
			params,
			body,
			start: constructorTokenPos.start,
			end: body.end,
		} as ConstructorStatement;
	}

	private parseIfStatement(): STATEMENT {
		const ifTokenPos = this.advance().__GSC._POS;

		this.expect(NodeType.OpenParen, 'following "if" statement');

		const test = this.parseExpr();

		this.expect(NodeType.CloseParen, 'following expression');

		const body = this.parseCodeBlock();

		let alt: CodeBlockNode = {} as CodeBlockNode;

		if (this.current().type == NodeType.Else) {
			this.advance();

			if (this.current().type == NodeType.If) {
				const altBody = this.parseIfStatement();
				alt = {
					kind: 'CodeBlockNode',
					body: [altBody],
					start: body.start,
					end: body.end,
				} as CodeBlockNode;
			} else {
				alt = this.parseCodeBlock();
			}
		}

		return {
			kind: 'IfStatement',
			test,
			body,
			alt,
			start: ifTokenPos.start,
			end: body.end,
		} as IfStatement;
	}

	// [EXPRESSIONS]
	private parseExpr(): EXPRESSION {
		return this.parseAsgExpr();
	}

	//
	// Expressions parsed in Order of Precedence (_OPC)
	//
	// See lexer/types.ts for more info
	//

	private parseAsgExpr(): EXPRESSION {
		const lhs = this.parseObjectExpr();

		if (this.current().type == NodeType.Equals) {
			this.advance();
			const rhs = this.parseAsgExpr();
			return {
				kind: 'AssignmentExpr',
				value: rhs,
				assigne: lhs,
				AsgOp: '=',
				start: lhs.start,
				end: rhs.end,
			} as AssignmentExpr;
		}

		return lhs;
	}

	private parseObjectExpr(): EXPRESSION {
		if (this.current().type !== NodeType.OpenBrace) {
			return this.parseTryCatchExpr();
		}

		const startTokenPos = this.advance().__GSC._POS;
		const properties = new Array<Property>();

		while (this.notEOF() && this.current().type != NodeType.CloseBrace) {
			const key = this.expect(
				NodeType.Identifier,
				'as key for KEY-VALUE pair declaration on object expression'
			);

			if (this.current().type == NodeType.Comma) {
				// { key, }
				this.advance();
				properties.push({
					key: key.value,
					kind: 'ObjectProperty',
					start: {
						Line: key.__GSC._POS.start.Line!,
						Column: key.__GSC._POS.start.Column!,
					},
					end: {
						Line: key.__GSC._POS.start.Line!,
						Column: key.__GSC._POS.start.Column!,
					},
				});
				continue;
			} else if (this.current().type == NodeType.CloseBrace) {
				// { key }
				properties.push({
					key: key.value,
					kind: 'ObjectProperty',
					start: {
						Line: key.__GSC._POS.start.Line!,
						Column: key.__GSC._POS.start.Column!,
					},
					end: {
						Line: key.__GSC._POS.start.Line!,
						Column: key.__GSC._POS.start.Column!,
					},
				} as Property);
				continue;
			}

			// { key: value }
			this.expect(NodeType.Colon, 'after identifier');
			const value = this.parseExpr();

			properties.push({
				kind: 'ObjectProperty',
				value,
				key: key.value,
				start: {
					Line: key.__GSC._POS.start.Line!,
					Column: key.__GSC._POS.start.Column!,
				},
				end: {
					Line: key.__GSC._POS.start.Line!,
					Column: key.__GSC._POS.start.Column!,
				},
			} as Property);

			if (this.current().type != NodeType.CloseBrace) {
				this.expect(
					NodeType.Comma,
					'or closing brace following property declaration'
				);
			}
		}

		const closeBracePos = this.expect(
			NodeType.CloseBrace,
			'at end of object declaration expression'
		).__GSC._POS;

		return {
			kind: 'ObjectLiteral',
			properties,
			start: startTokenPos.start,
			end: closeBracePos.end,
		} as ObjectLiteral;
	}

	private parseTryCatchExpr(): EXPRESSION {
		if (this.current().type != NodeType.Try) return this.parseArrayExpr();

		const tryTokenPos = this.advance().__GSC._POS;

		const tryBody = this.parseCodeBlock();

		const catchTokenPos = this.expect(
			NodeType.Catch,
			'in "Try-Catch" statement'
		);

		const args = this.parseArgs();
		const params: Array<string> = [];

		if (args.length != 1) {
			console.log(
				new ParseError(
					'"Catch" statements can only have one argument, containing the error variable',
					`${sourceFile}:${getErrorLocation(catchTokenPos)}`
				)
			);
		}

		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				console.log(
					new ParseError(
						'Expected arguments to be identifiers',
						`${sourceFile}:${getErrorLocation(this.current())}`
					)
				);
				process.exit(1);
			}

			params.push((arg as Identifier).symbol);
		}

		const catchBody = this.parseCodeBlock();

		return {
			kind: 'TryCatchStatement',
			tryBody,
			catchBody,
			errorIdentifier: params[0],
			start: tryTokenPos.start,
			end: catchBody.end,
		} as TryCatchStatement;
	}

	private parseArrayExpr(): EXPRESSION {
		if (this.current().type != NodeType.OpenBracket) {
			return this.parseLogOr();
		}

		const arrayPos = this.advance().__GSC._POS;
		const elements: ArrayLiteral['elements'] = [];

		while (this.notEOF() && this.current().type != NodeType.CloseBracket) {
			if (this.current().type == NodeType.Comma) this.advance(); // continue past commas
			// TODO:
		}

		return {
			kind: 'ArrayLiteral',
			elements,
		} as ArrayLiteral;
	}

	private parseLogOr(): EXPRESSION {
		let lhs = this.parseLogAnd();

		while (this.current().value == '||') {
			const op = this.advance().value;
			const rhs = this.parseLogAnd();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseLogAnd(): EXPRESSION {
		let lhs = this.parseEqualityExpr();

		while (this.current().value == '&&') {
			const op = this.advance().value;
			const rhs = this.parseEqualityExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
			} as BinaryExpr;
		}

		return lhs;
	}

	// TODO: BITWISE_OR
	// TODO: BITWISE_XOR
	// TODO: BITWISE_AND

	private parseEqualityExpr(): EXPRESSION {
		let lhs = this.parseMultiplicativeExpr();

		while (['!=', '==', '<=', '>='].includes(this.current().value)) {
			const op = this.advance().value;
			const rhs = this.parseEqualityExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
				start: lhs.start,
				end: rhs.end,
			} as BinaryExpr;
		}

		return lhs;
	}

	// TODO: BITWISE_SHIFT

	private parseMultiplicativeExpr(): EXPRESSION {
		let lhs = this.parseAdditiveExpr();

		while (['*', '/', '%'].includes(this.current().value)) {
			const op = this.advance().value;
			const rhs = this.parseMultiplicativeExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
				start: lhs.start,
				end: rhs.end,
			} as BinaryExpr;
		}

		return lhs;
	}

	private parseAdditiveExpr(): EXPRESSION {
		let lhs = this.parseCallMemberExpr();

		while (['+', '-'].includes(this.current().value)) {
			const op = this.advance().value;
			const rhs = this.parseAdditiveExpr();
			lhs = {
				kind: 'BinaryExpr',
				lhs,
				rhs,
				op,
				start: lhs.start,
				end: rhs.end,
			} as BinaryExpr;
		}

		return lhs;
	}

	// [OTHER]

	//
	// Any other operation that has the "_OPC.None" property
	//

	private parseCallMemberExpr(): EXPRESSION {
		const member = this.parseMemberExpr();

		if (this.current().type == NodeType.OpenParen) {
			return this.parseCallExpr(member);
		}

		return member;
	}

	private parseCallExpr(caller: EXPRESSION): EXPRESSION {
		const args = this.parseArgs();
		let callExpr: EXPRESSION = {
			kind: 'CallExpr',
			caller,
			args,
			start: caller.start,
			end: args[args.length - 1]?.end || caller.end,
		} as CallExpr;

		if (this.current().type == NodeType.OpenParen)
			callExpr = this.parseCallExpr(callExpr);

		return callExpr;
	}

	private parseMemberExpr(): EXPRESSION {
		let object = this.parseNewClassInstanceExpr();

		while (
			this.current().type == NodeType.Dot ||
			this.current().type == NodeType.OpenBracket
		) {
			const op = this.advance();
			let property: EXPRESSION;
			let computed: boolean;

			if (op.type == NodeType.Dot) {
				// non-computed values, like "foo.bar"
				computed = false;
				property = this.parseNewClassInstanceExpr();

				if (property.kind != 'Identifier') {
					console.log(
						new ParseError(
							'A dot operator must be used with a valid identifier',
							`${sourceFile}:${property.start.Line}:${property.start.Column}`
						)
					);
					process.exit(1);
				}
			} else {
				// computed values, like "foo[bar]"
				computed = true;
				property = this.parseExpr();
				this.expect(
					NodeType.CloseBracket,
					'following computed object member expression'
				);
			}

			object = {
				kind: 'MemberExpr',
				object,
				property,
				computed,
			} as MemberExpr;
		}

		return object;
	}

	private parseNewClassInstanceExpr(): EXPRESSION {
		if (this.current().type == NodeType.New) {
			const newTokenPos = this.advance().__GSC._POS;

			const name = this.expect(
				NodeType.Identifier,
				'following "new" keyword'
			);

			const args = this.parseArgs();

			return {
				kind: 'ClassNewInstanceExpr',
				name: name.value,
				args,
				start: newTokenPos.start,
				end: args[args.length - 1]?.end || name.__GSC._POS.end,
			} as ClassNewInstanceExpr;
		}

		return this.parsePrimaryExpression();
	}

	// Handles everything else
	private parsePrimaryExpression(): EXPRESSION {
		const token = this.current();

		switch (token.type) {
			case NodeType.Identifier:
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
				} as Identifier;

			case NodeType.Number:
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

			case NodeType.String:
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

			case NodeType.OpenParen:
				this.advance();
				const value = this.parseExpr();
				this.expect(NodeType.CloseParen);

				return value;

			default:
				console.log(
					new ParseError(
						`Uncaught: Unexpected token "${
							getTokenByTypeEnum(this.current().type)?.value
						}"`,
						`${sourceFile || 'GSREPL'}:${getErrorLocation(
							this.current()
						)}`
					)
				);
				process.exit(1);
		}
	}
}
