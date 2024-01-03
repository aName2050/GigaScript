import { NullVal, NumberVal, RuntimeVal } from './values';
import { BinaryExpr, NumericLiteral, Program, Stmt } from '../ast/ast';

function eval_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: 'null', value: 'null' } as NullVal;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
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
function eval_binary_expr(binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    // Numeric operations are only supported currently
    if (lhs.type == 'number' && rhs.type == 'number') {
        return eval_numeric_binary_expr(
            lhs as NumberVal,
            rhs as NumberVal,
            binop.operator
        );
    }

    // A null value is in the binary expression
    return { type: 'null', value: 'null' } as NullVal;
}

export function evaluate(node: Stmt): RuntimeVal {
    switch (node.kind) {
        case 'NumericLiteral':
            return {
                value: (node as NumericLiteral).value,
                type: 'number',
            } as NumberVal;

        case 'NullLiteral':
            return { value: 'null', type: 'null' } as NullVal;

        case 'BinaryExpr':
            return eval_binary_expr(node as BinaryExpr);

        case 'Program':
            return eval_program(node as Program);

        // Handle types not implemented
        default:
            console.error('RuntimeError: AST Node not implemented. ', node);
            process.exit(1);
    }
}
