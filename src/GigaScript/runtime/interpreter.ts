import { MK_NULL, MK_NUMBER, NumberVal, RuntimeVal } from './values';
import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Identifier,
    NumericLiteral,
    ObjectLiteral,
    Program,
    Stmt,
    VarDeclaration,
    FunctionDeclaration,
} from '../ast/ast';
import Environment from './environment';
import {
    eval_identifier,
    eval_binary_expr,
    eval_assignment,
    eval_object_expr,
    eval_call_expr,
} from './eval/expr';
import {
    eval_func_declaration,
    eval_program,
    eval_var_declaration,
} from './eval/stmt';

export function evaluate(node: Stmt, env: Environment): RuntimeVal {
    switch (node.kind) {
        case 'NumericLiteral':
            return {
                value: (node as NumericLiteral).value,
                type: 'number',
            } as NumberVal;

        case 'Identifier':
            return eval_identifier(node as Identifier, env);

        case 'ObjectLiteral':
            return eval_object_expr(node as ObjectLiteral, env);

        case 'CallExpr':
            return eval_call_expr(node as CallExpr, env);

        case 'AssignmentExpr':
            return eval_assignment(node as AssignmentExpr, env);

        case 'BinaryExpr':
            return eval_binary_expr(node as BinaryExpr, env);

        case 'Program':
            return eval_program(node as Program, env);

        case 'VarDeclaration':
            return eval_var_declaration(node as VarDeclaration, env);

        case 'FunctionDeclaration':
            return eval_func_declaration(node as FunctionDeclaration, env);

        // Handle types not implemented
        default:
            console.error('RuntimeError: AST Node not implemented. ', node);
            process.exit(1);
    }
}
