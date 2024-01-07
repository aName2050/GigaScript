import { FunctionDeclaration, Program, VarDeclaration } from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import { RuntimeValue, NULL, FunctionValue } from '../values';

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
    const value = declaration.value ? evaluate(declaration.value, env) : NULL();

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
