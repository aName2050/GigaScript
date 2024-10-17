import { SOURCE_FILE } from '../..';
import { SpecialError } from '../../../typescript/Error.types';
import { GSError } from '../../../typescript/GS.types';
import { STATEMENT } from '../../ast/ast';
import {
	Identifier,
	NumberLiteral,
	StringLiteral,
} from '../../ast/literals/literals.ast';
import Environment from '../env';
import { GSAny, GSNumber, GSString } from '../types';
import { evalIdentifier } from './eval/expr';

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
		// TODO: binop

		// statements
		// TODO: program
		// TODO: variable declaration
		// TODO: function declaration

		default:
			throw new GSError(
				SpecialError.NotSupportedError,
				`The AST Node, "${node.kind}", has not been implemented into GigaScript yet.`,
				`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
			);
	}
}
