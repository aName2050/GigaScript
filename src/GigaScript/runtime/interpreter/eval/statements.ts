import { CodeBlockNode, Program } from '../../../ast/ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../../../ast/declarations.ast';
import {
	ReturnStatement,
	ThrowStatement,
	TryCatchStatement,
} from '../../../ast/statements.ast';
import Environment from '../../env';
import { DataConstructors, DataType, FuncVal, Value } from '../../types';
import { evaluate } from '../interpreter';

export function evalProgram(
	program: Program,
	env: Environment
): Value<DataType, any> {
	let lastEvaluated: Value<DataType, any> = DataConstructors.NULL();

	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}

	return lastEvaluated;
}

export function evalVarDeclaration(
	declaration: VariableDeclaration,
	env: Environment
): Value<DataType, any> {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: DataConstructors.UNDEFINED();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function evalFuncDeclaration(
	declaration: FunctionDeclaration,
	env: Environment
): Value<DataType, Function> {
	const func = {
		type: 'function',
		name: declaration.name,
		params: declaration.parameters,
		body: declaration.body,
		decEnv: env,
	} as FuncVal;

	return env.declareVar(declaration.name, func, true);
}

export function evalReturnStatement(
	statement: ReturnStatement,
	env: Environment
): Value<DataType, any> {
	const value = evaluate(statement.value, env);

	return value;
}

export function evalTryCatchStatement(
	statement: TryCatchStatement,
	env: Environment
): Value<DataType, any> {
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
): Value<'null', null> {
	const message = evaluate(statement.message, env);

	throw message.value;
}

export function evalCodeBlock(
	body: CodeBlockNode,
	env: Environment,
	createNewEnv = true
): Value<DataType, any> {
	let scope: Environment;

	if (createNewEnv) scope = new Environment(env.cwd, env);
	else scope = env;

	let res: Value<DataType, any> = DataConstructors.NULL();

	for (const stmt of body.body) {
		res = evaluate(stmt, scope);
	}

	return res;
}
