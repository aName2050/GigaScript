import { sourceFile } from '../../../index';
import { AssignmentExpr, UnaryExpr } from '../../ast/assignments.ast';
import { Program, STATEMENT } from '../../ast/ast';
import { BinaryExpr } from '../../ast/binop.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../../ast/declarations.ast';
import { CallExpr, MemberExpr } from '../../ast/expressions.ast';
import {
	Identifier,
	NumberLiteral,
	ObjectLiteral,
	StringLiteral,
} from '../../ast/literals.ast';
import { ReturnStatement } from '../../ast/statements.ast';
import { GSError } from '../../util/gserror';
import Environment from '../env';
import { DataType, Value } from '../types';
import {
	evalAssignment,
	evalBinaryExpr,
	evalCallExpr,
	evalIdentifier,
	evalMemberExpr,
	evalObjectExpr,
} from './eval/expressions';
import {
	evalFuncDeclaration,
	evalProgram,
	evalReturnStatement,
	evalVarDeclaration,
} from './eval/statements';

export function evaluate(
	node: STATEMENT,
	env: Environment
): Value<DataType, any> {
	if (!node || !node.kind) {
		console.log(
			new GSError(
				'RuntimeError',
				'Unknown or undefined node during interpretation',
				`${sourceFile}:unknown:unknown`
			)
		);
		process.exit(1);
	}

	switch (node.kind) {
		// Handle literals
		case 'NumberLiteral':
			return {
				type: 'number',
				value: (node as NumberLiteral).value,
			} as Value<'number', number>;

		case 'StringLiteral':
			return {
				type: 'string',
				value: (node as StringLiteral).value,
			} as Value<'string', string>;

		case 'Identifier':
			return evalIdentifier(node as Identifier, env);

		// case 'ObjectLiteral':
		// 	return evalObjectExpr(node as ObjectLiteral, env);

		// Handle expressions
		// case 'MemberExpr':
		// 	return evalMemberExpr(env, null, node as MemberExpr);

		// case 'CallExpr':
		// 	return evalCallExpr(node as CallExpr, env);

		case 'BinaryExpr':
			return evalBinaryExpr(node as BinaryExpr, env);

		case 'AssignmentExpr':
			return evalAssignment(node as AssignmentExpr, env);

		// Handle statements
		case 'Program':
			return evalProgram(node as Program, env);

		case 'VariableDeclaration':
			return evalVarDeclaration(node as VariableDeclaration, env);

		case 'FunctionDeclaration':
			return evalFuncDeclaration(node as FunctionDeclaration, env);

		case 'ReturnStatement':
			return evalReturnStatement(node as ReturnStatement, env);

		// Handle non implemented types
		default:
			console.log(
				new GSError(
					'RuntimeError',
					`AST Node not implemented; "${node.kind}" has not been implemented into GigaScript yet`,
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
	}
}
