import { NULL } from '../../../../../old/GigaScript/runtime/values';
import { sourceFile } from '../../../../index';
import { Identifier } from '../../../ast/literals.ast';
import { GSError } from '../../../util/gserror';
import Environment from '../../env';
import {
	DataConstructors,
	DataType,
	FuncVal,
	NativeFnVal,
	ObjectValue,
	Value,
} from '../../types';

export function evalNumericBinaryExpr(
	lhs: Value<DataType, any>,
	rhs: Value<DataType, any>,
	op: string
): Value<DataType, any> {
	if (op === '!=') {
		return equals(lhs, rhs, false);
	} else if (op === '==') {
		return equals(lhs, rhs, true);
	} else if (op === '&&') {
		const blhs = lhs as Value<'boolean', boolean>;
		const brhs = rhs as Value<'boolean', boolean>;

		return DataConstructors.BOOLEAN(blhs.value && brhs.value);
	} else if (op === '||') {
		const blhs = lhs as Value<'boolean', boolean>;
		const brhs = rhs as Value<'boolean', boolean>;

		return DataConstructors.BOOLEAN(blhs.value || brhs.value);
	} else if (lhs.type === 'number' && rhs.type === 'number') {
		const nlhs = lhs as Value<'number', number>;
		const nrhs = rhs as Value<'number', number>;

		switch (op) {
			case '+':
				return DataConstructors.NUMBER(nlhs.value + nrhs.value);

			case '-':
				return DataConstructors.NUMBER(nlhs.value - nrhs.value);

			case '*':
				return DataConstructors.NUMBER(nlhs.value * nrhs.value);

			case '/':
				return DataConstructors.NUMBER(nlhs.value / nrhs.value);

			case '%':
				return DataConstructors.NUMBER(nlhs.value % nrhs.value);

			case '<':
				return DataConstructors.BOOLEAN(nlhs.value < nrhs.value);

			case '>':
				return DataConstructors.BOOLEAN(nlhs.value > nrhs.value);

			default:
				console.log(
					new GSError(
						'RuntimeError',
						`unknown operator "${op}" in operation ${lhs.value} ${op} ${rhs.value}`,
						`${sourceFile}:unknown:unknown`
					)
				);
				process.exit(1);
		}
	} else {
		return NULL();
	}
}

function equals(
	lhs: Value<DataType, any>,
	rhs: Value<DataType, any>,
	strict: boolean
): Value<DataType, any> {
	const compare = strict
		? (a: any, b: any) => a === b
		: (a: any, b: any) => a !== b;

	switch (lhs.type) {
		case 'boolean':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'boolean', boolean>).value,
					(rhs as Value<'boolean', boolean>).value
				)
			);

		case 'number':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'number', number>).value,
					(rhs as Value<'number', number>).value
				)
			);

		case 'string':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'string', string>).value,
					(rhs as Value<'string', string>).value
				)
			);

		case 'undefined':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'undefined', undefined>).value,
					(rhs as Value<'undefined', undefined>).value
				)
			);

		case 'null':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'null', null>).value,
					(rhs as Value<'null', null>).value
				)
			);

		case 'object':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as ObjectValue).properties,
					(rhs as ObjectValue).properties
				)
			);

		case 'array':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'array', Array<any>>).value,
					(rhs as Value<'array', Array<any>>).value
				)
			);

		case 'function':
			return DataConstructors.BOOLEAN(
				compare((lhs as FuncVal).body, (rhs as FuncVal).body)
			);

		case 'nativeFn':
			return DataConstructors.BOOLEAN(
				compare((lhs as NativeFnVal).call, (rhs as NativeFnVal).call)
			);

		default:
			console.log(
				new GSError(
					'RuntimeError',
					`Unknown type in comparison: LHS: ${lhs}, RHS: ${rhs}`,
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
	}
}

export function evalIdentifier(
	identifier: Identifier,
	env: Environment
): Value<DataType, any> {
	const val = env.lookupVar(identifier.symbol);
	return val;
}
