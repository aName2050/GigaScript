import {
	NULL,
	NumberValue,
	RuntimeValue,
	StringValue,
	UNDEFINED,
} from './values';
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
	ForStatement,
	ImportStatement,
	ExportStatement,
	WhileStatement,
	BreakStatement,
	ContinueStatement,
	ClassDeclaration,
	ClassInit,
	ReturnStatement,
} from '../ast/ast';
import Environment from './environment';
import {
	eval_identifier,
	eval_binary_expr,
	eval_assignment,
	eval_object_expr,
	eval_call_expr,
	eval_member_expr,
	eval_class_init_expr,
} from './eval/expr';
import {
	eval_func_declaration,
	eval_if_statement,
	eval_program,
	eval_var_declaration,
	eval_try_catch_statement,
	eval_for_statement,
	eval_import_statement,
	eval_export_statement,
	eval_while_statement,
	eval_break_statement,
	eval_continue_statement,
	eval_class_declaration,
	eval_return_statement,
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

		case 'ClassInitExpr':
			return eval_class_init_expr(node as ClassInit, env);

		// Handle program evaluate
		case 'Program':
			return eval_program(node as Program, env);

		// Handle statements
		case 'VarDeclaration':
			return eval_var_declaration(node as VarDeclaration, env);

		case 'FunctionDeclaration':
			return eval_func_declaration(node as FunctionDeclaration, env);

		case 'ReturnStatement':
			return eval_return_statement(node as ReturnStatement, env);

		case 'ClassDeclaration':
			return eval_class_declaration(node as ClassDeclaration, env);

		case 'IfStatement':
			return eval_if_statement(node as IfStatement, env);

		case 'TryCatchStatement':
			return eval_try_catch_statement(env, node as TryCatchStatement);

		case 'ForStatement':
			return eval_for_statement(node as ForStatement, env);

		case 'WhileStatement':
			return eval_while_statement(node as WhileStatement, env);

		case 'BreakStatement':
			return eval_break_statement(node as BreakStatement, env);

		case 'ContinueStatement':
			return eval_continue_statement(node as ContinueStatement, env);

		case 'ImportStatement':
			return eval_import_statement(node as ImportStatement, env);

		case 'ExportStatement':
			return eval_export_statement(node as ExportStatement, env);

		// Handle types not implemented
		default:
			console.error('RuntimeError: AST Node not implemented.', node);
			process.exit(1);
	}
}
