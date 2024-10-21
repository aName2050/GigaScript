import { SOURCE_FILE } from '../..';
import { SpecialError } from '../../../typescript/Error.types';
import { GSError } from '../../../typescript/GS.types';
import { Program, STATEMENT } from '../../ast/ast';
import { BinaryExpr } from '../../ast/expressions/binop.ast';
import { CallExpr } from '../../ast/expressions/expressions.ast';
import {
	Identifier,
	NumberLiteral,
	StringLiteral,
} from '../../ast/literals/literals.ast';
import {
	FunctionDeclaration,
	VariableDeclaration,
} from '../../ast/statements/declarations.ast';
import { ReturnStatement } from '../../ast/statements/statements.ast';
import Environment from '../env';
import { GSAny, GSNumber, GSString } from '../types';
import { evalBinaryExpr, evalCallExpr, evalIdentifier } from './eval/expr';
import {
	evalFunctionDeclaration,
	evalProgram,
	evalReturnStatement,
	evalVariableDeclaration,
} from './eval/stmt';

export function evaluate(node: STATEMENT, env: Environment): GSAny {
	if (!node || !node.kind)
		throw new GSError(
			SpecialError.RuntimeError,
			'Undefined node during interpretation',
			`${SOURCE_FILE}`
		);

	switch (node.kind) {
		// literals
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

		// expressions
		case 'BinaryExpr':
			return evalBinaryExpr(node as BinaryExpr, env);

		case 'CallExpr':
			return evalCallExpr(node as CallExpr, env);

		// statements
		case 'Program':
			return evalProgram(node as Program, env);

		case 'VariableDeclaration':
			return evalVariableDeclaration(node as VariableDeclaration, env);

		case 'FunctionDeclaration':
			return evalFunctionDeclaration(node as FunctionDeclaration, env);

		case 'ReturnStatement':
			return evalReturnStatement(node as ReturnStatement, env);

		default:
			throw new GSError(
				SpecialError.NotSupportedError,
				`The AST Node, "${node.kind}", has not been implemented into GigaScript yet.`,
				`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
			);
	}
}
