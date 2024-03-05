import {
	BinaryExpr,
	Expr,
	Identifier,
	NumericLiteral,
	Program,
	Stmt,
	VarDeclaration,
	AssignmentExpr,
	Property,
	ObjectLiteral,
	MemberExpr,
	CallExpr,
	FunctionDeclaration,
	StringLiteral,
	IfStatement,
	TryCatchStatement,
	ForStatement,
	ImportStatement,
	ExportStatement,
	WhileStatement,
	BreakStatement,
	ContinueStatement,
	ClassDeclaration,
	ClassProperty,
	ClassMethod,
	ClassInit,
	ReturnStatement,
	ThrowStatement,
	ClassConstructor,
} from '../ast/ast';
import { tokenize } from '../lexer/lexer';
import { Class, Token, TokenType } from '../types';

/**
 * Produces valid AST from source.
 */
export default class Parser {
	private tokens: Token[] = [];

	/**
	 * Determine if parsing is complete by reaching the END OF FILE token.
	 */
	private not_eof(): boolean {
		return this.tokens[0].type != TokenType.EOF;
	}

	/**
	 * Returns current token
	 */
	private at(): Token {
		return this.tokens[0] as Token;
	}

	/**
	 * Returns the previous token then shifts the token array to the next token.
	 */
	private eat(): Token {
		const prev = this.tokens.shift() as Token;
		return prev;
	}

	/**
	 * Returns the next token
	 */
	private next(): Token {
		return this.tokens[1] as Token;
	}

	/**
	 * Returns the previous token and then shifts the token array to the next token.
	 * Also checks the type of the expected token and throws an error if it doesn't match.
	 */
	private expect(type: TokenType, err: any): Token {
		const prev = this.tokens.shift() as Token;
		if (!prev || prev.type != type) {
			console.error(
				`ParseError: ${err}`,
				prev,
				`- Expecting: type`,
				type
			);
			process.exit(1);
		}

		return prev;
	}

	public generateAST(source: string): Program {
		this.tokens = tokenize(source);
		const program: Program = {
			kind: 'Program',
			body: [],
		};

		// Parse until end of file
		while (this.not_eof()) {
			program.body.push(this.parse_stmt());
		}

		return program;
	}

	public generateGSXAST(source: Token[]): Program {
		this.tokens = source;
		const program: Program = {
			kind: 'Program',
			body: [],
		};

		while (this.not_eof()) {
			program.body.push(this.parse_stmt());
		}

		return program;
	}

	/**
	 * Handle complex statements
	 */
	private parse_stmt(): Stmt {
		switch (this.at().type) {
			case TokenType.Let:
			case TokenType.Const:
				// console.log('parsing let | const');
				return this.parse_var_declaration();
			case TokenType.Func:
				// console.log('parsing func');
				return this.parse_func_declaration();
			case TokenType.Return:
				// console.log('parsing return');
				return this.parse_return_statement();
			case TokenType.Class:
				// console.log('parsing class');
				return this.parse_class_declaration();
			case TokenType.Constructor:
				// console.log('parsing constructor');
				return this.parse_constructor_statement();
			case TokenType.If:
				// console.log('parsing if');
				return this.parse_if_statement();
			case TokenType.For:
				// console.log('parsing for');
				return this.parse_for_statement();
			case TokenType.While:
				// console.log('parsing while');
				return this.parse_while_statement();
			case TokenType.Break:
				// console.log('parsing break');
				return this.parse_break_statement();
			case TokenType.Continue:
				// console.log('parsing continue');
				return this.parse_continue_statement();
			case TokenType.Import:
				// console.log('parsing import');
				return this.parse_import_statement();
			case TokenType.Export:
				// console.log('parsing export');
				return this.parse_export_statement();
			case TokenType.Throw:
				// console.log('parsing throw');
				return this.parse_throw_statement();

			default:
				// console.log('parsing expression');
				return this.parse_expr();
		}
	}

	/**
	 * Handle blocks of code
	 */
	private parse_block_statement(): Stmt[] {
		this.expect(
			TokenType.OpenBrace,
			`Expected "{" at start of code block.`
		);

		const body: Stmt[] = [];

		while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
			const stmt = this.parse_stmt();
			body.push(stmt);
		}

		this.expect(TokenType.CloseBrace, `Expected "}" at end of code block.`);

		return body;
	}

	private parse_for_statement(): Stmt {
		this.eat(); // advance past for keyword

		this.expect(
			TokenType.OpenParen,
			'Expected "(" following "for" keyword'
		);

		const init = this.parse_var_declaration();
		const test = this.parse_expr();

		this.expect(
			TokenType.Semicolon,
			'Expected ";" following test expression in "for" statement'
		);

		const update = this.parse_assignment_expr();

		this.expect(
			TokenType.CloseParen,
			'Expected ")" following update expression in "for" statement'
		);

		const body = this.parse_block_statement();

		return {
			kind: 'ForStatement',
			init,
			test,
			update,
			body,
		} as ForStatement;
	}

	private parse_while_statement(): Stmt {
		this.eat(); // advance past while keyword

		this.expect(
			TokenType.OpenParen,
			'Expected "(" following while statement'
		);

		const test = this.parse_expr();

		this.expect(
			TokenType.CloseParen,
			'Expected ")" following while statement test expression.'
		);

		const body = this.parse_block_statement();

		return {
			kind: 'WhileStatement',
			test,
			body,
		} as WhileStatement;
	}

	private parse_break_statement(): Stmt {
		this.eat(); // advance past break keyword

		return {
			kind: 'BreakStatement',
		} as BreakStatement;
	}

	private parse_continue_statement(): Stmt {
		this.eat(); // advance past continue keyword

		return {
			kind: 'ContinueStatement',
		} as ContinueStatement;
	}

	private parse_if_statement(): Stmt {
		this.eat(); // advance past if keyword
		this.expect(
			TokenType.OpenParen,
			'Expected "(" following if statement.'
		);

		const test = this.parse_expr();

		this.expect(
			TokenType.CloseParen,
			'Expected ")" following if statement test expression.'
		);

		const body = this.parse_block_statement();

		let alt: Stmt[] = [];

		if (this.at().type == TokenType.Else) {
			this.eat(); // advance past else keyword

			if (this.at().type == TokenType.If) {
				// Allows Else If statements
				alt = [this.parse_if_statement()];
			} else {
				alt = this.parse_block_statement();
			}
		}

		return {
			kind: 'IfStatement',
			test,
			body,
			alt,
		} as IfStatement;
	}

	private parse_import_statement(): Stmt {
		this.eat(); // advance past import keyword

		const variable = this.expect(
			TokenType.Identifier,
			'Expected identifier after import statement.'
		).value;

		this.expect(
			TokenType.From,
			'Expected "from" keyword following identifier.'
		);

		const file = this.expect(
			TokenType.String,
			'Expected string to file location in import statement.'
		).value;

		return {
			kind: 'ImportStatement',
			variable,
			file,
		} as ImportStatement;
	}

	private parse_export_statement(): Stmt {
		this.eat(); // advance past export keyword

		const exportedValue = this.parse_expr();

		if (exportedValue.kind != 'Identifier') {
			throw 'Export statements can only export identifiers (variables and functions).';
		}

		this.expect(
			TokenType.Semicolon,
			'Expected semicolon (;) following export statement'
		);

		return {
			kind: 'ExportStatement',
			identifier: (exportedValue as Identifier).symbol,
			exportedValue,
		} as ExportStatement;
	}

	/**
	 * Handle function declarations
	 *
	 * func IDENT (...args) {
	 *    ...code
	 * }
	 */
	private parse_func_declaration(): Stmt {
		this.eat(); // advance past func keyword
		const name = this.expect(
			TokenType.Identifier,
			'Expected identifier following func keyword.'
		).value;

		const args = this.parse_args();
		const params: string[] = [];
		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				throw 'Expected paramters to of type string.';
			}

			params.push((arg as Identifier).symbol);
		}

		const body: Stmt[] = this.parse_block_statement();

		const func = {
			body,
			name,
			parameters: params,
			kind: 'FunctionDeclaration',
		} as FunctionDeclaration;

		return func;
	}

	private parse_return_statement(): Stmt {
		this.eat(); // advance past return keyword

		const value = this.parse_expr();

		this.expect(
			TokenType.Semicolon,
			'Expected ";" following return statement.'
		);

		return {
			kind: 'ReturnStatement',
			value,
		} as ReturnStatement;
	}

	/**
	 * Handle variable declarations
	 *
	 * let IDENT;
	 * (let | const) IDENT = EXPR;
	 *
	 * Semicolons (;) are required for variable declarations
	 */
	private parse_var_declaration(): Stmt {
		const isConstant = this.eat().type == TokenType.Const;
		const identifier = this.expect(
			TokenType.Identifier,
			'Expected identifier following variable declaration keywords.'
		).value;

		if (this.at().type == TokenType.Semicolon) {
			this.eat(); // eat semicolon
			if (isConstant) {
				throw 'ParseError: Constant values must be declared with a value.';
			}

			return {
				kind: 'VarDeclaration',
				constant: false,
				identifier,
			} as VarDeclaration;
		}

		this.expect(
			TokenType.Equals,
			'Unexpected token. Expected "=" following identifier for variable declaration.'
		);

		const declaration = {
			kind: 'VarDeclaration',
			value: this.parse_expr(),
			identifier,
			constant: isConstant,
		} as VarDeclaration;

		this.expect(
			TokenType.Semicolon,
			'Variable declaration statements must end with a semicolon.'
		);

		return declaration;
	}

	private parse_class_declaration(): Stmt {
		this.eat(); // advance past class keyword

		const name = this.expect(
			TokenType.Identifier,
			'Expected identifier following class declaration.'
		).value;

		this.expect(
			TokenType.OpenBrace,
			'Expected "{" following class identifier.'
		);

		const Class = this.parse_class_body();

		this.expect(TokenType.CloseBrace, 'Expected "}" following class body.');

		return {
			kind: 'ClassDeclaration',
			name,
			properties: Class.properties,
			methods: Class.methods,
		} as ClassDeclaration;
	}

	private parse_constructor_statement(): Stmt {
		this.eat(); // advance past constructor keyword

		const args = this.parse_args();
		const parameters: string[] = [];
		for (const arg of args) {
			if (arg.kind !== 'Identifier') {
				console.log(arg);
				throw 'Expected paramters to be of type string.';
			}

			parameters.push((arg as Identifier).symbol);
		}

		const body = this.parse_block_statement();

		return {
			kind: 'ClassConstructor',
			parameters,
			body,
		} as ClassConstructor;
	}

	private parse_class_body(): Class {
		const properties: ClassProperty[] = new Array<ClassProperty>();
		const methods: ClassMethod[] = new Array<ClassMethod>();
		let constructor: Stmt | undefined = undefined;
		// Check for public/private properties/methods
		while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
			if (
				this.at().type == TokenType.Public ||
				this.at().type == TokenType.Private
			) {
				const isPublic = this.eat().type === TokenType.Public; // advance past public/private keyword and check if public property/method
				const identifier = this.expect(
					TokenType.Identifier,
					`Expected identifier following ${
						isPublic ? 'public' : 'private'
					} keyword declaration.`
				).value;

				if (this.at().type == TokenType.Semicolon) {
					// undefined PROPERTY
					this.eat(); // advance past semicolon

					const classProp = {
						kind: 'ClassProperty',
						public: isPublic,
						identifier,
					} as ClassProperty;

					properties.push(classProp);
				} else if (this.at().type == TokenType.Equals) {
					// defined PROPERTY
					this.eat(); // advance past =
					const classProp = {
						kind: 'ClassProperty',
						public: isPublic,
						identifier,
						value: this.parse_expr(),
					} as ClassProperty;

					this.expect(
						TokenType.Semicolon,
						'Expected semicolon following class property declaration.'
					);

					properties.push(classProp);
				} else if (this.at().type == TokenType.OpenParen) {
					// defined METHOD
					const args = this.parse_args();
					const params: string[] = [];
					for (const arg of args) {
						if (arg.kind !== 'Identifier') {
							console.log(arg);
							throw 'Expected paramters to of type string.';
						}

						params.push((arg as Identifier).symbol);
					}

					const body: Stmt[] = this.parse_block_statement();

					const classMethod = {
						kind: 'ClassMethod',
						public: isPublic,
						identifier,
						parameters: params,
						body,
					} as ClassMethod;

					methods.push(classMethod);
				} else {
					throw `Unexpected token following ${
						isPublic ? 'public' : 'private'
					} property declaration. Token: ${this.at()}`;
				}
			} else if (this.at().type == TokenType.Constructor) {
				constructor = this.parse_constructor_statement();
			}
		}

		return {
			constructor,
			properties,
			methods,
		} as Class;
	}

	private parse_throw_statement(): Stmt {
		this.eat(); // advance past throw keyword
		const message = this.parse_expr();

		this.expect(
			TokenType.Semicolon,
			'Expected ";"  following throw statement.'
		);

		return { kind: 'ThrowStatement', message } as ThrowStatement;
	}

	/**
	 * Handle expressions
	 */
	private parse_expr(): Expr {
		return this.parse_assignment_expr();
	}

	/**
	 * Handle variable reassignments
	 */
	private parse_assignment_expr(): Expr {
		const left = this.parse_class_init();
		if (this.at().type == TokenType.Equals) {
			this.eat(); // advance past equals token
			const value = this.parse_assignment_expr();
			return {
				value,
				assigne: left,
				kind: 'AssignmentExpr',
			} as AssignmentExpr;
		}

		return left;
	}

	private parse_class_init(): Expr {
		if (this.at().type == TokenType.New) {
			this.eat(); // advance past "new" keyword
			const identifier = this.expect(
				TokenType.Identifier,
				'Expected identifier following "new" keyword.'
			).value;

			const args = this.parse_args();

			return {
				kind: 'ClassInitExpr',
				name: identifier,
				args,
			} as ClassInit;
		}

		return this.parse_object_expr();
	}

	private parse_object_expr(): Expr {
		// { Prop[] }
		if (this.at().type !== TokenType.OpenBrace) {
			return this.parse_try_catch_expr(); // check for Try-Catch statement
		}

		this.eat(); // advance past the open brace
		const properties = new Array<Property>();

		while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
			const key = this.expect(
				TokenType.Identifier,
				'Expected key for key: value pair declaration.'
			).value;

			// Allows object key: value shortcut
			// { key, }
			if (this.at().type == TokenType.Comma) {
				this.eat(); // advance past the comma
				properties.push({ key, kind: 'Property' } as Property);
				continue;
			}
			// { key }
			else if (this.at().type == TokenType.CloseBrace) {
				properties.push({ key, kind: 'Property' } as Property);
				continue;
			}

			// { key: value }
			this.expect(TokenType.Colon, 'Expected colon after identifier');
			const value = this.parse_expr();

			properties.push({ kind: 'Property', value, key });
			if (this.at().type != TokenType.CloseBrace) {
				this.expect(
					TokenType.Comma,
					'Expected comma or closing brace following property declaration.'
				);
			}
		}

		this.expect(
			TokenType.CloseBrace,
			'Expected closing brace when defining an object'
		);
		return { kind: 'ObjectLiteral', properties } as ObjectLiteral;
	}

	/**
	 * Handle multiplication (*), division (/), and modulo (%) operations
	 */
	private parse_multiplicitave_expr(): Expr {
		let left = this.parse_additive_expr();

		while (['/', '*', '%'].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_additive_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	/**
	 * Handle addition (+) and subtraction (-) operations
	 */
	private parse_additive_expr(): Expr {
		let left = this.parse_comparison_expr();

		while (['+', '-'].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_comparison_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	private parse_comparison_expr(): Expr {
		let left = this.parse_equality_expr();

		while (['<', '>'].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_equality_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	private parse_equality_expr(): Expr {
		let left = this.parse_and_expr();

		while (['!=', '=='].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_equality_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	private parse_and_expr(): Expr {
		let left = this.parse_or_expr();

		while (['&&'].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_or_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	private parse_or_expr(): Expr {
		let left = this.parse_call_member_expr();

		while (['||'].includes(this.at().value)) {
			const operator = this.eat().value;
			const right = this.parse_call_member_expr();
			left = {
				kind: 'BinaryExpr',
				left,
				right,
				operator,
			} as BinaryExpr;
		}

		return left;
	}

	private parse_try_catch_expr(): Expr {
		if (this.at().value !== 'try') return this.parse_multiplicitave_expr();

		this.eat(); // advance past try keyword

		const body = this.parse_block_statement();

		if (this.at().value !== 'catch')
			throw '"Try-Catch" statements must have a "catch" statement after "try" statement.';

		this.eat(); // advance past catch keyword

		const alt = this.parse_block_statement();

		return {
			kind: 'TryCatchStatement',
			body,
			alt,
		} as TryCatchStatement;
	}

	// foo.bar()()
	private parse_call_member_expr(): Expr {
		const member = this.parse_member_expr();

		if (this.at().type == TokenType.OpenParen) {
			return this.parse_call_expr(member);
		}

		return member;
	}

	private parse_call_expr(caller: Expr): Expr {
		let call_expr: Expr = {
			kind: 'CallExpr',
			caller,
			args: this.parse_args(),
		} as CallExpr;

		if (this.at().type == TokenType.OpenParen) {
			call_expr = this.parse_call_expr(call_expr);
		}

		return call_expr;
	}

	private parse_args(): Expr[] {
		this.expect(
			TokenType.OpenParen,
			'Expected "(" before parameters list.'
		);
		const args =
			this.at().type == TokenType.CloseParen
				? []
				: this.parse_arguments_list();

		this.expect(TokenType.CloseParen, 'Expected ")" after parameters');
		return args;
	}

	private parse_arguments_list(): Expr[] {
		const args = [this.parse_assignment_expr()];

		while (this.at().type == TokenType.Comma && this.eat()) {
			args.push(this.parse_assignment_expr());
		}

		return args;
	}

	private parse_member_expr(): Expr {
		let object = this.parse_primary_expr();

		while (
			this.at().type == TokenType.Dot ||
			this.at().type == TokenType.OpenBracket
		) {
			const operator = this.eat();
			let property: Expr;
			let computed: boolean;

			// non-computed values, like foo.bar
			if (operator.type == TokenType.Dot) {
				computed = false;
				// get ident
				property = this.parse_primary_expr();
				if (property.kind != 'Identifier') {
					throw 'Cannot use dot operator without valid identifier.';
				}
			} else {
				// adds suport for foo[bar]
				computed = true;
				property = this.parse_expr();
				this.expect(
					TokenType.CloseBracket,
					'Expected "]" at end of object member expression'
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

	/**
	 * Order of Precedence
	 *
	 * Assignment Operators =
	 * New Class Init
	 * Object
	 * Try Catch Expr
	 * Multiplication * / %
	 * Addition/Subtraction + -
	 * Comparison Operators < >
	 * Equality Operators == !=
	 * Logical AND &&
	 * Logical OR ||
	 * Call
	 * Member
	 * PrimaryExpr
	 */

	/**
	 * Parse literal values and grouping expressions
	 */
	private parse_primary_expr(): Expr {
		const tk = this.at().type;

		// Figure which token we are at and return its literal value
		switch (tk) {
			// User defined values
			case TokenType.Identifier:
				return {
					kind: 'Identifier',
					symbol: this.eat().value,
				} as Identifier;

			case TokenType.Number:
				return {
					kind: 'NumericLiteral',
					value: parseFloat(this.eat().value),
				} as NumericLiteral;

			case TokenType.String:
				return {
					kind: 'StringLiteral',
					value: this.eat().value,
				} as StringLiteral;

			case TokenType.OpenParen: {
				this.eat(); // eat the opening paren
				const value = this.parse_expr();
				this.expect(
					TokenType.CloseParen,
					`Expected ")" and instead saw ${value}`
				); // expect closing paren

				return value;
			}

			default:
				console.error(`ParseError: Unexpected token: `, this.at());
				process.exit(1);
		}
	}
}
