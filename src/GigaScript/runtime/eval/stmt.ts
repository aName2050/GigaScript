import {
	BreakStatement,
	ClassDeclaration,
	ContinueStatement,
	ExportStatement,
	ForStatement,
	FunctionDeclaration,
	IfStatement,
	ImportStatement,
	Program,
	ReturnStatement,
	Stmt,
	ThrowStatement,
	TryCatchStatement,
	VarDeclaration,
	WhileStatement,
} from '../../ast/ast';
import Parser from '../../parser/parser';
import { tokenizeGSX } from '../../lexer/gsx';
import Environment, { createGlobalScope } from '../environment';
import { evaluate } from '../interpreter';
import {
	RuntimeValue,
	NULL,
	FunctionValue,
	BooleanValue,
	STRING,
	UNDEFINED,
} from '../values';
import { eval_assignment } from './expr';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function eval_program(program: Program, env: Environment): RuntimeValue {
	let lastEvaluated: RuntimeValue = NULL();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}

export function eval_var_declaration(
	declaration: VarDeclaration,
	env: Environment
): RuntimeValue {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: UNDEFINED();

	return env.delcareVar(declaration.identifier, value, declaration.constant);
}

export function eval_func_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): RuntimeValue {
	const func = {
		type: 'function',
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.delcareVar(declaration.name, func, true);
}

export function eval_if_statement(
	declaration: IfStatement,
	env: Environment
): RuntimeValue {
	const test = evaluate(declaration.test, env);

	if ((test as BooleanValue).value === true) {
		return eval_body(declaration.body, env);
	} else if (declaration.alt) {
		return eval_body(declaration.alt, env);
	} else {
		return NULL();
	}
}

export function eval_body(
	body: Stmt[],
	env: Environment,
	newEnv = true
): RuntimeValue {
	let scope: Environment;

	if (newEnv) {
		scope = new Environment(env.cwd, env);
	} else {
		scope = env;
	}

	let result: RuntimeValue = NULL();

	// evaluate each line of the body
	for (const stmt of body) {
		result = evaluate(stmt, scope);
	}

	return result;
}

export function eval_try_catch_statement(
	env: Environment,
	declaration?: TryCatchStatement
): RuntimeValue {
	const try_env = new Environment(env.cwd, env);
	const catch_env = new Environment(env.cwd, env);

	try {
		return eval_body(declaration?.body!, try_env, false);
	} catch (e) {
		env.assignVar('error', STRING(String(e)));
		return eval_body(declaration?.alt!, catch_env, false);
	}
}

export function eval_for_statement(
	declaration: ForStatement,
	env: Environment
): RuntimeValue {
	env = new Environment(env.cwd, env);

	eval_var_declaration(declaration.init, env);

	const body = declaration.body;
	const update = declaration.update;

	let test = evaluate(declaration.test, env);

	if ((test as BooleanValue).value !== true) return NULL(); // test expression failed

	do {
		eval_assignment(update, env);

		try {
			eval_body(body, new Environment(env.cwd, env), false);
		} catch (e) {
			if (e == 'BREAK_LOOP') {
				// break statement
				break;
			} else if (e == 'CONTINUE_LOOP') {
				// continue statement
				continue;
			} else {
				// unknown error code
				throw e;
			}
		}

		test = evaluate(declaration.test, env);
	} while ((test as BooleanValue).value);

	return NULL();
}

export function eval_while_statement(
	declaration: WhileStatement,
	env: Environment
): RuntimeValue {
	env = new Environment(env.cwd, env);

	let test = evaluate(declaration.test, env);
	const body = declaration.body;

	do {
		try {
			eval_body(body, new Environment(env.cwd, env), false);
		} catch (e) {
			if (e == 'BREAK_LOOP') {
				// break statement
				break;
			} else if (e == 'CONTINUE_LOOP') {
				// continue statement
				continue;
			} else {
				// unknown error code
				throw e;
			}
		}

		test = evaluate(declaration.test, env);
	} while ((test as BooleanValue).value);

	return NULL();
}

export function eval_break_statement(
	_declaration: BreakStatement,
	_env: Environment
): RuntimeValue {
	throw 'BREAK_LOOP';
}

export function eval_continue_statement(
	_declaration: ContinueStatement,
	_env: Environment
): RuntimeValue {
	throw 'CONTINUE_LOOP';
}

export function eval_import_statement(
	declaration: ImportStatement,
	env: Environment
): RuntimeValue {
	// Returns NULL
	const fileLocation = `${env.cwd}/${declaration.file}`;

	const variable = declaration.variable;

	// Run external file
	// Run Function from index.ts but modified for this use
	// TypeScript doesn't like the imported copy :(
	const parser = new Parser();
	const extEnv = createGlobalScope(fileLocation);

	let file = fs.readFileSync(fileLocation, { encoding: 'utf-8' });

	if (fileLocation.endsWith('.g')) {
		// handle standard GigaScript files
		const program = parser.generateAST(file);
		evaluate(program, extEnv);

		const exportedValues = Array.from(extEnv.getExportedValues());

		for (let i = 0; i < exportedValues.length; i++) {
			const val = exportedValues[i];
			if (variable == val[0]) {
				const value = val[1] as RuntimeValue;
				env.delcareVar(variable, value, true);
			}
		}

		return NULL();
	} else if (fileLocation.endsWith('.gsx')) {
		// handle gen-z GigaScript files
		const translation = tokenizeGSX(file);
		const program = parser.generateGSXAST(translation);
		evaluate(program, extEnv);

		const exportedValues = Array.from(extEnv.getExportedValues());

		for (let i = 0; i < exportedValues.length; i++) {
			const val = exportedValues[i];
			if (variable == val[0]) {
				const value = val[1] as RuntimeValue;
				env.delcareVar(variable, value, true);
			}
		}

		return NULL();
	} else {
		throw `RuntimeError: FileImportError: File does not end with ".g" or ".gsx".
		"${path.extname(fileLocation)}" is not a supported file type.`;
	}
}

export function eval_export_statement(
	declaration: ExportStatement,
	env: Environment
): RuntimeValue {
	const exportedValue = evaluate(declaration.exportedValue, env);

	env.addExportedValue(declaration.identifier, exportedValue);

	return NULL();
}

export function eval_class_declaration(
	declaration: ClassDeclaration,
	env: Environment
): RuntimeValue {
	env.declareClass(
		declaration.name,
		declaration.properties,
		declaration.methods,
		declaration.constructor
	);

	return NULL();
}

export function eval_return_statement(
	statement: ReturnStatement,
	env: Environment
): RuntimeValue {
	const value = evaluate(statement.value, env);
	return value;
}

export function eval_throw_statement(
	statement: ThrowStatement,
	env: Environment
): RuntimeValue {
	const message = evaluate(statement.message, env);

	throw message.value;
}
