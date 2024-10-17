import { Program } from '../../../ast/ast';
import { Identifier } from '../../../ast/literals/literals.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../../../ast/statements/declarations.ast';
import Environment from '../../env';
import {
	DataConstructors,
	FunctionValue,
	GSAny,
	GSFunction,
} from '../../types';
import { evaluate } from '../interpreter';

export function evalProgram(program: Program, env: Environment): GSAny {
	let lastEvaluated: GSAny = DataConstructors.NULL();

	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}

	return lastEvaluated;
}

export function evalVariableDeclaration(
	declaration: VariableDeclaration,
	env: Environment
): GSAny {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: DataConstructors.UNDEFINED();

	return env.declareVariable(
		{ symbol: declaration.identifier } as Identifier,
		value,
		declaration.constant
	);
}

export function evalFunctionDeclaration(
	declaration: FunctionDeclaration,
	env: Environment
): GSAny {
	const func = {
		type: 'Function',
		name: declaration.name,
		params: declaration.parameters,
		declarationEnvironment: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVariable(
		{ symbol: func.name } as Identifier,
		func,
		true
	) as GSFunction;
}
