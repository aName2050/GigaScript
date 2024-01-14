import {
    FunctionDeclaration,
    IfStatement,
    Program,
    Stmt,
    TryCatchStatement,
    VarDeclaration,
} from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import {
    RuntimeValue,
    NULL,
    FunctionValue,
    BooleanValue,
    STRING,
} from '../values';

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
        scope = new Environment(env);
    } else {
        scope = env;
    }

    let result: RuntimeValue = NULL();

    // evaluate each line of the body
    for (const stmt of body) {
        // TODO: implement continue and break keywords
        result = evaluate(stmt, scope);
    }

    return result;
}

export function eval_try_catch_statement(
    env: Environment,
    declaration?: TryCatchStatement
): RuntimeValue {
    const try_env = new Environment(env);
    const catch_env = new Environment(env);

    try {
        return eval_body(declaration?.body!, try_env, false);
    } catch (e) {
        env.assignVar('error', STRING(String(e)));
        return eval_body(declaration?.alt!, catch_env, false);
    }
}
