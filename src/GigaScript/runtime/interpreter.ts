import { NULL, NumberValue, RuntimeValue, StringValue } from './values';
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
    MemberExpr,
    StringLiteral,
    IfStatement,
    TryCatchStatement,
} from '../ast/ast';
import Environment from './environment';
import {
    eval_identifier,
    eval_binary_expr,
    eval_assignment,
    eval_object_expr,
    eval_call_expr,
    eval_member_expr,
} from './eval/expr';
import {
    eval_func_declaration,
    eval_if_statement,
    eval_program,
    eval_var_declaration,
    eval_try_catch_statement,
} from './eval/stmt';

export function evaluate(node: Stmt, env: Environment): RuntimeValue {
    switch (node.kind) {
        // Handle literals
        case 'NumericLiteral':
            return {
                value: (node as NumericLiteral).value,
                type: 'number',
            } as NumberValue;
        case 'StringLiteral':
            return {
                type: 'string',
                value: (node as StringLiteral).value,
            } as StringValue;

        case 'Identifier':
            return eval_identifier(node as Identifier, env);

        case 'ObjectLiteral':
            return eval_object_expr(node as ObjectLiteral, env);

        // Handle expressions
        case 'CallExpr':
            return eval_call_expr(node as CallExpr, env);

        case 'AssignmentExpr':
            return eval_assignment(node as AssignmentExpr, env);

        case 'BinaryExpr':
            return eval_binary_expr(node as BinaryExpr, env);

        case 'MemberExpr':
            return eval_member_expr(env, null, node as MemberExpr);

        // Handle program evaluate
        case 'Program':
            return eval_program(node as Program, env);

        // Handle statements
        case 'VarDeclaration':
            return eval_var_declaration(node as VarDeclaration, env);

        case 'FunctionDeclaration':
            return eval_func_declaration(node as FunctionDeclaration, env);

        case 'IfStatement':
            return eval_if_statement(node as IfStatement, env);

        case 'TryCatchStatement':
            return eval_try_catch_statement(env, node as TryCatchStatement);

        // Handle types not implemented
        default:
            console.error('RuntimeError: AST Node not implemented.', node);
            process.exit(1);
    }
}
