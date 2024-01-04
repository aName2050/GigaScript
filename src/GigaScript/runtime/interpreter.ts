import { MK_NULL, MK_NUMBER, NumberVal, RuntimeVal } from './values';
import {
    BinaryExpr,
    Identifier,
    NumericLiteral,
    Program,
    Stmt,
} from '../ast/ast';
import Environment from './environment';

function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}

/**
 * Evaluate numeric operations with binary operators
 */
function eval_numeric_binary_expr(
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
function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
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

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evaluate(node: Stmt, env: Environment): RuntimeVal {
    switch (node.kind) {
        case 'NumericLiteral':
            return {
                value: (node as NumericLiteral).value,
                type: 'number',
            } as NumberVal;

        case 'Identifier':
            return eval_identifier(node as Identifier, env);

        case 'BinaryExpr':
            return eval_binary_expr(node as BinaryExpr, env);

        case 'Program':
            return eval_program(node as Program, env);

        // Handle types not implemented
        default:
            console.error('RuntimeError: AST Node not implemented. ', node);
            process.exit(1);
    }
}
