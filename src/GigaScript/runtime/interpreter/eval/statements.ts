import { Program } from '../../../ast/ast';
import { FuncDeclaration, VarDeclaration } from '../../../ast/declarations.ast';
import { ReturnStatement } from '../../../ast/statements.ast';
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
	declaration: VarDeclaration,
	env: Environment
): Value<DataType, any> {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: DataConstructors.UNDEFINED();

	return env.delcareVar(declaration.identifier, value, declaration.constant);
}

export function evalFuncDeclaration(
	declaration: FuncDeclaration,
	env: Environment
): Value<DataType, Function> {
	const func = {
		type: 'function',
		name: declaration.name,
		params: declaration.parameters,
		body: declaration.body,
		decEnv: env,
	} as FuncVal;

	return env.delcareVar(declaration.name, func, true);
}

export function evalReturnStatement(
	statement: ReturnStatement,
	env: Environment
): Value<DataType, any> {
	const value = evaluate(statement.value, env);

	return value;
}
