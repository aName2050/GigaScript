import {
	NATIVE_FUNCTION,
	NULL,
	NUMBER,
	NumberValue,
	OBJECT,
	STRING,
	StringValue,
} from '../runtime/values';
import { getValue } from '../util/util';

export const print = NATIVE_FUNCTION((args, scope) => {
	const output: any[] = [];

	for (const arg of args) {
		output.push(getValue(arg));
	}

	console.log(...output);

	return NULL();
});

export const timestamp = NATIVE_FUNCTION((args, scope) => {
	return NUMBER(Date.now());
});

export const math = OBJECT(
	new Map()
		.set('pi', NUMBER(Math.PI))
		.set('e', NUMBER(Math.E))
		.set(
			'sqrt',
			NATIVE_FUNCTION((args, _scope) => {
				const num = (args[0] as NumberValue).value;
				return NUMBER(Math.sqrt(num));
			})
		)
		.set(
			'abs',
			NATIVE_FUNCTION((args, _scope) => {
				const num = (args[0] as NumberValue).value;
				return NUMBER(Math.abs(num));
			})
		)
		.set(
			'round',
			NATIVE_FUNCTION((args, _scope) => {
				const num = (args[0] as NumberValue).value;
				return NUMBER(Math.round(num));
			})
		)
		.set(
			'random',
			NATIVE_FUNCTION((args, _scope) => {
				const max = Math.floor((args[0] as NumberValue).value);
				const min = Math.ceil((args[1] as NumberValue).value);
				return NUMBER(Math.random() * (max - min + 1) + min);
			})
		)
		.set(
			'ceil',
			NATIVE_FUNCTION((args, _scope) => {
				return NUMBER(Math.ceil((args[0] as NumberValue).value));
			})
		)
		.set(
			'exp',
			NATIVE_FUNCTION((args, _scope) => {
				return NUMBER(Math.exp((args[0] as NumberValue).value));
			})
		)
		.set(
			'floor',
			NATIVE_FUNCTION((args, _scope) => {
				return NUMBER(Math.floor((args[0] as NumberValue).value));
			})
		)
		.set(
			'max',
			NATIVE_FUNCTION((args, _scope) => {
				const values: Array<number> = new Array<number>();
				args.forEach(arg => {
					values.push((arg as NumberValue).value);
				});
				return NUMBER(Math.max(...values));
			})
		)
		.set(
			'pow',
			NATIVE_FUNCTION((args, _scope) => {
				return NUMBER(
					Math.pow(
						(args[0] as NumberValue).value,
						(args[1] as NumberValue).value
					)
				);
			})
		)
		.set(
			'round',
			NATIVE_FUNCTION((args, _scope) => {
				return NUMBER(Math.round((args[0] as NumberValue).value));
			})
		)
);

export const format = NATIVE_FUNCTION((args, scope) => {
	const str = args.shift() as StringValue;

	let res = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i] as StringValue;

		res = str.value.replace(/\${}/, arg.value);
	}

	if (!args[0]) throw '"format" expected 2 arguments, but got 1.';

	return STRING(res);
});
