import { SOURCE_FILE } from '../../..';
import { SpecialError } from '../../../../typescript/Error.types';
import { GSError } from '../../../../typescript/GS.types';
import { BinaryExpr } from '../../../ast/expressions/binop.ast';
import { Identifier } from '../../../ast/literals/literals.ast';
import { Node } from '../../../parser/nodes';
import Environment from '../../env';
import {
	DataConstructors,
	GSAny,
	GSBoolean,
	GSNil,
	GSNumber,
	GSString,
	GSUndefined,
} from '../../types';
import { evaluate } from '../interpreter';

export function evalIdentifier(
	identifier: Identifier,
	env: Environment
): GSAny {
	const val = env.lookupVar(identifier);
	return val;
}

export function evalBinaryExpr(binop: BinaryExpr, env: Environment): GSAny {
	const lhs = evaluate(binop.lhs, env);
	const rhs = evaluate(binop.rhs, env);

	return evalNumericBinaryExpr(lhs, rhs, binop.op);
}

export function evalNumericBinaryExpr(
	lhs: GSAny,
	rhs: GSAny,
	op: BinaryExpr['op']
): GSAny {
	switch (op) {
		case Node.ComparisonOperator.NotEqual:
			return equals(lhs, rhs, false);
		case Node.ComparisonOperator.IsEqual:
			return equals(lhs, rhs, true);
		case Node.LogicalOperator.LogicalAND: {
			const blhs = lhs as GSBoolean;
			const brhs = rhs as GSBoolean;

			return DataConstructors.BOOLEAN(blhs.value && brhs.value);
		}
		case Node.LogicalOperator.LogicalOR: {
			const blhs = lhs as GSBoolean;
			const brhs = rhs as GSBoolean;

			return DataConstructors.BOOLEAN(blhs.value || brhs.value);
		}
		default:
			if (lhs.type === 'number' && rhs.type === 'number') {
				const nlhs = lhs as GSNumber;
				const nrhs = rhs as GSNumber;

				switch (op) {
					case Node.Symbol.Plus:
						return DataConstructors.NUMBER(nlhs.value + nrhs.value);

					case Node.Symbol.Minus:
						return DataConstructors.NUMBER(nlhs.value - nrhs.value);

					case Node.Symbol.Multiply:
						return DataConstructors.NUMBER(nlhs.value * nrhs.value);

					case Node.Symbol.Divide:
						return DataConstructors.NUMBER(nlhs.value / nrhs.value);

					case Node.Symbol.Modulo:
						return DataConstructors.NUMBER(nlhs.value % nrhs.value);

					case Node.ComparisonOperator.LessThan:
						return DataConstructors.BOOLEAN(
							nlhs.value < nrhs.value
						);

					case Node.ComparisonOperator.GreaterThan:
						return DataConstructors.BOOLEAN(
							nlhs.value > nrhs.value
						);

					case Node.ComparisonOperator.LessThanOrEquals:
						return DataConstructors.BOOLEAN(
							nlhs.value <= nrhs.value
						);

					case Node.ComparisonOperator.GreaterThanOrEquals:
						return DataConstructors.BOOLEAN(
							nlhs.value >= nrhs.value
						);

					default:
						throw new GSError(
							SpecialError.RuntimeError,
							`unknown operator "${op}`,
							`${SOURCE_FILE}`
						);
				}
			} else {
				return DataConstructors.NULL();
			}
	}
}

function equals(lhs: GSAny, rhs: GSAny, strict: boolean): GSAny {
	const compare = strict
		? (a: any, b: any) => a === b
		: (a: any, b: any) => a !== b;

	switch (lhs.type) {
		case 'boolean':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSBoolean).value, (rhs as GSBoolean).value)
			);

		case 'number':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSNumber).value, (rhs as GSNumber).value)
			);

		case 'string':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSString).value, (rhs as GSString).value)
			);

		case 'undefined':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSUndefined).value, (rhs as GSUndefined).value)
			);

		case 'nil':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSNil).value, (rhs as GSNil).value)
			);

		// TODO: object
		// TODO: array
		// TODO: function
		// TODO: nativefn
		// TODO: class

		default:
			throw new GSError(
				SpecialError.RuntimeError,
				`Unknown type in comparison: LHS: ${lhs}, RHS: ${rhs}`,
				`${SOURCE_FILE}`
			);
	}
}

// TODO: call expr
