import { sourceFile } from '../../../index';
import { STATEMENT } from '../../ast/ast';
import {
	Identifier,
	NumberLiteral,
	ObjectLiteral,
	StringLiteral,
} from '../../ast/literals.ast';
import { GSError } from '../../util/gserror';
import Environment from '../env';
import { DataType, Value } from '../types';
import { evalIdentifier } from './eval/expressions';

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
		//     return eval_object_expr(node as ObjectLiteral, env);

		// Handle non implemented types
		default:
			console.log(
				new GSError(
					'RuntimeError',
					'AST Node not implemented',
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
	}
}
