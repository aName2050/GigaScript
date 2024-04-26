import { DataConstructors, GSNumber, GSString } from '../runtime/types';
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
				const num = (args[0] as GSNumber).value;
				return DataConstructors.NUMBER(Math.sqrt(num));
			})
		)
		.set(
			'random',
			DataConstructors.NATIVEFN((args, _scope) => {
				const max = (args[0] as GSNumber) || DataConstructors.NUMBER(1);
				const min = (args[1] as GSNumber) || DataConstructors.NUMBER(0);

				return DataConstructors.NUMBER(
					Math.random() * (max.value - min.value) + min.value
				);
			})
		)
);

export const formatString = DataConstructors.NATIVEFN((args, scope) => {
	const str = args.shift() as GSString;

	let out = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i] as GSString;

		out = str.value.replace(/\${}/, arg.value);
	}

	if (!args[0])
		throw 'TypeError: "formatString" expected 2 arguments, but got 1';

	return DataConstructors.STRING(out);
});
