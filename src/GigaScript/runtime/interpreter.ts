import { MK_NULL, MK_NUMBER, NumberVal, RuntimeVal } from './values';
import {
    AssignmentExpr,
    BinaryExpr,
    Identifier,
    NumericLiteral,
    ObjectLiteral,
    Program,
    Stmt,
    VarDeclaration,
} from '../ast/ast';
import Environment from './environment';
import {
    eval_identifier,
    eval_binary_expr,
    eval_assignment,
    eval_object_expr,
} from './eval/expr';
import { eval_program, eval_var_declaration } from './eval/stmt';

export function evaluate(node: Stmt, env: Environment): RuntimeVal {
    switch (node.kind) {
        case 'NumericLiteral':
            return {
                value: (node as NumericLiteral).value,
                type: 'number',
            } as NumberVal;

        case 'ObjectLiteral':
            return eval_object_expr(node as ObjectLiteral, env);

        case 'Identifier':
            return eval_identifier(node as Identifier, env);

        case 'BinaryExpr':
            return eval_binary_expr(node as BinaryExpr, env);

        case 'Program':
            return eval_program(node as Program, env);

        case 'VarDeclaration':
            return eval_var_declaration(node as VarDeclaration, env);

        case 'AssignmentExpr':
            return eval_assignment(node as AssignmentExpr, env);

        // Handle types not implemented
        default:
            console.error('RuntimeError: AST Node not implemented. ', node);
            process.exit(1);
    }
}
