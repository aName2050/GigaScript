import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Identifier,
    ObjectLiteral,
} from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import {
    NumberVal,
    RuntimeVal,
    MK_NULL,
    ObjectVal,
    NativeFunctionVal,
    FunctionVal,
} from '../values';

/**
 * Evaluate numeric operations with binary operators
 */
export function eval_numeric_binary_expr(
    lhs: NumberVal,
    rhs: NumberVal,
    operator: string
): NumberVal {
    let result: number;
    if (operator == '+') result = lhs.value + rhs.value;
    else if (operator == '-') result = lhs.value - rhs.value;
    else if (operator == '*') result = lhs.value * rhs.value;
    else if (operator == '/')
        result = lhs.value / rhs.value; // TODO: add division by zero checks
    else result = lhs.value % rhs.value;

    return { value: result, type: 'number' } as NumberVal;
}

/**
 * Evaluates expressions based on the binary operation type
 */
export function eval_binary_expr(
    binop: BinaryExpr,
    env: Environment
): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    // Numeric operations are only supported currently
    if (lhs.type == 'number' && rhs.type == 'number') {
        return eval_numeric_binary_expr(
            lhs as NumberVal,
            rhs as NumberVal,
            binop.operator
        );
    }

    // A null value is in the binary expression
    return MK_NULL();
}

export function eval_identifier(
    ident: Identifier,
    env: Environment
): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment(
    node: AssignmentExpr,
    env: Environment
): RuntimeVal {
    if (node.assigne.kind !== 'Identifier') {
        throw `Invalid LHS inside assignment expression ${JSON.stringify(
            node.assigne
        )}`;
    }

    const varName = (node.assigne as Identifier).symbol;
    return env.assignVar(varName, evaluate(node.value, env));
}

export function eval_object_expr(
    obj: ObjectLiteral,
    env: Environment
): RuntimeVal {
    const object = { type: 'object', properties: new Map() } as ObjectVal;
    for (const { key, value } of obj.properties) {
        const runtimeVal =
            value == undefined ? env.lookupVar(key) : evaluate(value, env);

        object.properties.set(key, runtimeVal);
    }

    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
    const args = expr.args.map(arg => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type == 'nativeFunction') {
        const result = (fn as NativeFunctionVal).call(args, env);
        return result;
    }

    if (fn.type == 'function') {
        const func = fn as FunctionVal;
        const scope = new Environment(func.declarationEnv);

        // Create parameters as variables for new scope
        for (let i = 0; i < func.parameters.length; i++) {
            // TODO: check parameter bounds
            //       verify arity of function

            const varName = func.parameters[i];
            scope.delcareVar(varName, args[i], false);
        }

        let result: RuntimeVal = MK_NULL();

        // evaluate the function body line by line
        for (const stmt of func.body) {
            result = evaluate(stmt, scope);
        }

        return result;
    }

    throw 'Cannot call a value that is not a function: ' + JSON.stringify(fn);
}
