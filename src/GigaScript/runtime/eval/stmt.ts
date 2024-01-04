import { Program, VarDeclaration } from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import { RuntimeVal, MK_NULL } from '../values';

export function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}

export function eval_var_declaration(
    declaration: VarDeclaration,
    env: Environment
): RuntimeVal {
    const value = declaration.value
        ? evaluate(declaration.value, env)
        : MK_NULL();

    return env.delcareVar(declaration.identifier, value, declaration.constant);
}
