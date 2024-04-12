import { sourceFile } from '../../../index';
import { AssignmentExpr } from '../../ast/assignments.ast';
import { Program, STATEMENT } from '../../ast/ast';
import { BinaryExpr } from '../../ast/binop.ast';
import { ClassDeclaration, ClassNewInstanceExpr } from '../../ast/class.ast';
import { IfStatement } from '../../ast/conditionals.ast';
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
import { ExportStatement, ImportStatement } from '../../ast/module.ast';
import {
	ReturnStatement,
	ThrowStatement,
	TryCatchStatement,
} from '../../ast/statements.ast';
import { GSError } from '../../util/gserror';
import Environment from '../env';
import { GSAny, GSNumber, GSString } from '../types';
import {
	evalAssignment,
	evalBinaryExpr,
	evalCallExpr,
	evalIdentifier,
	evalMemberExpr,
	evalObjectExpr,
	evalNewClassInstanceExpr,
} from './eval/expressions';
import {
	evalFuncDeclaration,
	evalProgram,
	evalReturnStatement,
	evalVarDeclaration,
	evalTryCatchStatement,
	evalThrowStatement,
	evalExportStatement,
	evalImportStatement,
	evalClassDeclaration,
	evalIfStatement,
} from './eval/statements';

export function evaluate(node: STATEMENT, env: Environment): GSAny {
	if (!node || !node.kind) {
		console.log(
			new GSError(
				'RuntimeError',
				'Unknown or undefined node during interpretation',
				`${sourceFile}`
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
			} as GSNumber;

		case 'StringLiteral':
			return {
				type: 'string',
				value: (node as StringLiteral).value,
			} as GSString;

		case 'Identifier':
			return evalIdentifier(node as Identifier, env);

		case 'ObjectLiteral':
			return evalObjectExpr(node as ObjectLiteral, env);

		// Handle expressions
		case 'MemberExpr':
			return evalMemberExpr(env, null, node as MemberExpr);

		case 'CallExpr':
			return evalCallExpr(node as CallExpr, env);

		case 'BinaryExpr':
			return evalBinaryExpr(node as BinaryExpr, env);

		case 'AssignmentExpr':
			return evalAssignment(node as AssignmentExpr, env);

		case 'ClassNewInstanceExpr':
			return evalNewClassInstanceExpr(node as ClassNewInstanceExpr, env);

		// Handle statements
		case 'Program':
			return evalProgram(node as Program, env);

		case 'ClassDeclaration':
			return evalClassDeclaration(node as ClassDeclaration, env);

		case 'VariableDeclaration':
			return evalVarDeclaration(node as VariableDeclaration, env);

		case 'FunctionDeclaration':
			return evalFuncDeclaration(node as FunctionDeclaration, env);

		case 'ReturnStatement':
			return evalReturnStatement(node as ReturnStatement, env);

		case 'TryCatchStatement':
			return evalTryCatchStatement(node as TryCatchStatement, env);

		case 'ThrowStatement':
			return evalThrowStatement(node as ThrowStatement, env);

		case 'ImportStatement':
			return evalImportStatement(node as ImportStatement, env);
		case 'ExportStatement':
			return evalExportStatement(node as ExportStatement, env);

		case 'IfStatement':
			return evalIfStatement(node as IfStatement, env);

		// Handle non implemented types
		default:
			console.log(
				new GSError(
					'RuntimeError',
					`AST Node not implemented; "${node.kind}" has not been implemented into GigaScript yet`,
					`${sourceFile}:${node.start.Line}:${node.start.Column}`
				)
			);
			process.exit(1);
	}
}
