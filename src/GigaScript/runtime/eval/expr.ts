import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Identifier,
    MemberExpr,
    ObjectLiteral,
} from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import {
    NumberValue,
    RuntimeValue,
    NULL,
    ObjectValue,
    NativeFunctionValue,
    FunctionValue,
} from '../values';

/**
 * Evaluate numeric operations with binary operators
 */
export function eval_numeric_binary_expr(
    lhs: NumberValue,
    rhs: NumberValue,
    operator: string
): NumberValue {
    let result: number;
    if (operator == '+') result = lhs.value + rhs.value;
    else if (operator == '-') result = lhs.value - rhs.value;
    else if (operator == '*') result = lhs.value * rhs.value;
    else if (operator == '/')
        result = lhs.value / rhs.value; // TODO: add division by zero checks
    else result = lhs.value % rhs.value;

    return { value: result, type: 'number' } as NumberValue;
}

/**
 * Evaluates expressions based on the binary operation type
 */
export function eval_binary_expr(
    binop: BinaryExpr,
    env: Environment
): RuntimeValue {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    // Numeric operations are only supported currently
    if (lhs.type == 'number' && rhs.type == 'number') {
        return eval_numeric_binary_expr(
            lhs as NumberValue,
            rhs as NumberValue,
            binop.operator
        );
    }

    // A null value is in the binary expression
    return NULL();
}

export function eval_identifier(
    ident: Identifier,
    env: Environment
): RuntimeValue {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment(
    node: AssignmentExpr,
    env: Environment
): RuntimeValue {
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
): RuntimeValue {
    const object = { type: 'object', properties: new Map() } as ObjectValue;

    for (const { key, value } of obj.properties) {
        const runtimeVal =
            value == undefined ? env.lookupVar(key) : evaluate(value, env);

        object.properties.set(key, runtimeVal);
    }

    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeValue {
    const args = expr.args.map(arg => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type == 'nativeFunction') {
        const result = (fn as NativeFunctionValue).call(args, env);
        return result;
    }

    if (fn.type == 'function') {
        const func = fn as FunctionValue;
        const scope = new Environment(func.declarationEnv);

        // Create parameters as variables for new scope
        for (let i = 0; i < func.parameters.length; i++) {
            if (func.parameters.length != args.length)
                throw 'Parameters and arguments lengths do not match.';

            const varName = func.parameters[i];
            scope.delcareVar(varName, args[i], false);
        }

        let result: RuntimeValue = NULL();

        // evaluate the function body line by line
        for (const stmt of func.body) {
            result = evaluate(stmt, scope);
        }

        return result;
    }

    throw 'Cannot call a value that is not a function: ' + JSON.stringify(fn);
}

export function eval_member_expr(
    expr: MemberExpr,
    env: Environment
): RuntimeValue {
    const objVal = evaluate(expr.object, env);

    if (objVal.type == 'object') {
        // TODO: finish implementation of object member access
    }

    throw `Cannot not access the properties of a value that is not an object`;
}
