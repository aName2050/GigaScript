import path from 'node:path';
import { CodeBlockNode, Program, STATEMENT } from '../../../ast/ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../../../ast/declarations.ast';
import { ExportStatement, ImportStatement } from '../../../ast/module.ast';
import {
	ReturnStatement,
	ThrowStatement,
	TryCatchStatement,
} from '../../../ast/statements.ast';
import Environment, { createGlobalScope } from '../../env';
import {
	DataConstructors,
	FuncVal,
	GSAny,
	GSBoolean,
	GSFunction,
	GSNull,
	GSUndefined,
} from '../../types';
import { evaluate } from '../interpreter';
import Parser from '../../../parser/parser';
import * as fs from 'node:fs';
import { Identifier } from '../../../ast/literals.ast';
import { GSError } from '../../../util/gserror';
import { sourceFile } from '../../../../index';
import { ClassDeclaration } from '../../../ast/class.ast';
import { IfStatement } from '../../../ast/conditionals.ast';
import { ModuleNames, Modules } from '../../../native/modules';
import {
	BreakStatement,
	ContinueStatement,
	ForStatement,
	WhileStatement,
} from '../../../ast/loops.ast';
import { evalAssignment } from './expressions';

export function evalProgram(program: Program, env: Environment): GSAny {
	let lastEvaluated: GSAny = DataConstructors.NULL();

	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}

	return lastEvaluated;
}

export function evalVarDeclaration(
	declaration: VariableDeclaration,
	env: Environment
): GSAny {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: DataConstructors.UNDEFINED();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function evalFuncDeclaration(
	declaration: FunctionDeclaration,
	env: Environment
): GSFunction {
	const func = {
		type: 'function',
		name: declaration.name,
		params: declaration.parameters,
		body: declaration.body,
		decEnv: env,
	} as FuncVal;

	return env.declareVar(declaration.name, func, true) as GSFunction;
}

export function evalReturnStatement(
	statement: ReturnStatement,
	env: Environment
): GSAny {
	const value = evaluate(statement.value, env);

	return value;
}

export function evalTryCatchStatement(
	statement: TryCatchStatement,
	env: Environment
): GSAny {
	const tryEnv = new Environment(env.cwd, env);
	const catchEnv = new Environment(env.cwd, env);

	try {
		return evalCodeBlock(statement.tryBody, tryEnv, false);
	} catch (e) {
		catchEnv.declareVar(
			statement.errorIdentifier,
			DataConstructors.STRING(String(e)),
			true
		);
		return evalCodeBlock(statement.catchBody, catchEnv, false);
	}
}

export function evalThrowStatement(
	statement: ThrowStatement,
	env: Environment
): GSNull {
	const message = evaluate(statement.message, env);

	throw message.value;
}

export function evalCodeBlock(
	body: CodeBlockNode,
	env: Environment,
	createNewEnv = true
): GSAny {
	let scope: Environment;

	if (createNewEnv) scope = new Environment(env.cwd, env);
	else scope = env;

	let res: GSAny = DataConstructors.NULL();

	for (const stmt of body.body) {
		res = evaluate(stmt, scope);
	}

	return res;
}

export function evalImportStatement(
	node: ImportStatement,
	env: Environment
): GSAny {
	if (ModuleNames.includes(node.source)) {
		const module = Modules.get(node.source)!;

		const imports = Array.from(node.imports);
		const exports = Array.from(module);

		for (let i = 0; i < exports.length; i++) {
			for (let j = 0; j < imports.length; j++) {
				if (exports[i][0] == imports[j][0]) {
					const identifier = imports[j][1] as string;
					const value = exports[i][1];

					if ((value as ClassDeclaration).name) {
						const Class = value as ClassDeclaration;
						env.declareClass(
							Class.name,
							Class.properties,
							Class.methods,
							Class.constructor
						);
					} else env.declareVar(identifier, value as GSAny, true);
				}
			}
		}

		return DataConstructors.NULL();
	}

	const fileLocation = path.resolve(`${env.cwd}/${node.source}`);

	const imports = Array.from(node.imports);

	// Run imported file to extract any exported values
	const parser = new Parser();
	const externalEnv = createGlobalScope(path.dirname(fileLocation));

	const fileContent = fs.readFileSync(fileLocation, { encoding: 'utf-8' });

	if (fileLocation.endsWith('.g')) {
		parser.tokenizeSource(fileContent);
		const program: Program = parser.generateAST();
		evaluate(program, externalEnv);

		const exports = Array.from(externalEnv.exports);

		for (let i = 0; i < exports.length; i++) {
			for (let j = 0; j < imports.length; j++) {
				if (exports[i][0] == imports[j][0]) {
					const identifier = imports[j][1] as string;
					const value = exports[i][1];
					console.log(value);
					if ((value as ClassDeclaration).name) {
						env.declareClass(
							(value as ClassDeclaration).name,
							(value as ClassDeclaration).properties,
							(value as ClassDeclaration).methods,
							(value as ClassDeclaration).constructor
						);
					} else env.declareVar(identifier, value as GSAny, true);
				}
			}
		}
	} else if (fileLocation.endsWith('.gsx')) {
		throw 'RuntimeError: importing GSX files is currently not supported';
	} else {
		throw `RuntimeError: Unsupported file type "${path.extname(
			fileLocation
		)}`;
	}

	return DataConstructors.NULL();
}

export function evalExportStatement(
	node: ExportStatement,
	env: Environment
): GSAny {
	const exportedValue = evaluate(node.value, env);

	if (node.value.kind == 'VariableDeclaration') {
		env.addExport(
			(node.value as VariableDeclaration).identifier,
			exportedValue
		);
	} else if (node.value.kind == 'FunctionDeclaration') {
		env.addExport((node.value as FunctionDeclaration).name, exportedValue);
	} else if (node.value.kind == 'Identifier') {
		env.addExport((node.value as Identifier).symbol, exportedValue);
	} else if (node.value.kind == 'ClassDeclaration') {
		env.addExport(
			(node.value as ClassDeclaration).name,
			node.value as ClassDeclaration
		);
	} else {
		throw new GSError(
			'RuntimeError',
			`ExportError: cannot export type "${node.value.kind}"`,
			`${sourceFile}:${node.start.Line}:${node.start.Column}`
		);
	}

	return DataConstructors.NULL();
}

export function evalClassDeclaration(
	node: ClassDeclaration,
	env: Environment
): GSAny {
	env.declareClass(
		node.name,
		node.properties,
		node.methods,
		node.constructor
	);

	return DataConstructors.NULL();
}

export function evalIfStatement(node: IfStatement, env: Environment): GSAny {
	const testExpr = evaluate(node.test, env);

	if ((testExpr as GSBoolean).value === true) {
		return evalCodeBlock(node.body, env);
	} else if (node.alt?.body) {
		return evalCodeBlock(node.alt, env);
	} else {
		return DataConstructors.NULL();
	}
}

export function evalForStatement(node: ForStatement, env: Environment): GSNull {
	env = new Environment(env.cwd, env);

	evalVarDeclaration(node.initializer, env);

	let test = evaluate(node.test, env);

	if ((test as GSBoolean).value !== true) return DataConstructors.NULL(); // expression is false

	do {
		evalAssignment(node.update, env);

		try {
			evalCodeBlock(node.body, new Environment(env.cwd, env), false);
		} catch (e) {
			if (e == 'GS.NO_ERROR.BREAK_LOOP') break;
			else if (e == 'GS.NO_ERROR.CONTINUE_LOOP') continue;
			else throw e;
		}

		test = evaluate(node.test, env);
	} while ((test as GSBoolean).value);

	return DataConstructors.NULL();
}

export function evalWhileStatement(
	node: WhileStatement,
	env: Environment
): GSNull {
	env = new Environment(env.cwd, env);

	let test = evaluate(node.test, env);

	do {
		try {
			evalCodeBlock(node.body, new Environment(env.cwd, env), false);
		} catch (e) {
			if (e == 'GS.NO_ERROR.BREAK_LOOP') break;
			else if (e == 'GS.NO_ERROR.CONTINUE_LOOP') continue;
			else throw e;
		}

		test = evaluate(node.test, env);
	} while ((test as GSBoolean).value);

	return DataConstructors.NULL();
}

export function evalBreakStatement(
	_node: BreakStatement,
	_env: Environment
): GSUndefined {
	throw 'GS.NO_ERROR.BREAK_LOOP';
}

export function evalContinueStatement(
	_node: ContinueStatement,
	_env: Environment
): GSUndefined {
	throw 'GS.NO_ERROR.CONTINUE_LOOP';
}
