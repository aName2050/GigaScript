import { DataConstructors, Value } from '../runtime/types';
import { getValue } from '../util/getValue';

export const print = DataConstructors.NATIVEFN((args, scope) => {
	const output: Array<any> = [];

	for (const arg of args) {
		output.push(getValue(arg));
	}

	console.log(...output);

	return DataConstructors.NULL();
});

export const generateTimestamp = DataConstructors.NATIVEFN((args, scope) => {
	return DataConstructors.NUMBER(Date.now());
});

export const math = DataConstructors.OBJECT(
	new Map()
		.set('pi', DataConstructors.NUMBER(Math.PI))
		.set('e', DataConstructors.NUMBER(Math.E))
		.set(
			'sqrt',
			DataConstructors.NATIVEFN((args, _scope) => {
				const num = (args[0] as Value<'number', number>).value;
				return DataConstructors.NUMBER(Math.sqrt(num));
			})
		)
);

export const formatString = DataConstructors.NATIVEFN((args, scope) => {
	const str = args.shift() as Value<'string', string>;

	let out = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i] as Value<'string', string>;

		out = str.value.replace(/\${}/, arg.value);
	}

	if (!args[0])
		throw 'TypeError: "formatString" expected 2 arguments, but got 1';

	return DataConstructors.STRING(out);
});
