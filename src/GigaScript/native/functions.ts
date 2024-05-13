import {
	DataConstructors,
	GSArray,
	GSNumber,
	GSObject,
	GSString,
} from '../runtime/types';
import { getValue } from '../util/getValue';
import { objectToMap } from '../util/objToMap';

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

export const Array = DataConstructors.OBJECT(
	new Map()
		.set(
			'push',
			DataConstructors.NATIVEFN((args, _scope) => {
				if (args[0].type != 'array')
					throw 'Expected type "array" as first argument';
				if (!args[1]) throw 'Expected 2 arguments, instead got 1';

				(args[0] as GSArray).value.push(args[1]);

				return args[0];
			})
		)
		.set(
			'pop',
			DataConstructors.NATIVEFN((args, _scope) => {
				if (args[0].type != 'array')
					throw 'Expected type "array" as first argument';

				return (args[0] as GSArray).value.pop();
			})
		)
		.set(
			'has',
			DataConstructors.NATIVEFN((args, _scope) => {
				if (args[0].type != 'array')
					throw 'Expected type "array" as first argument';
				if (!args[1]) throw 'Expected 2 arguments, instead got 1';

				let has = false;
				(args[0] as GSArray).value.forEach(val => {
					if (val.value == args[1].value) has = true;
				});

				return DataConstructors.BOOLEAN(has);
			})
		)
		.set(
			'getFromIndex',
			DataConstructors.NATIVEFN((args, _scope) => {
				if (args[0].type != 'array')
					throw 'Expected type "array" as first argument';
				if (args[1].type != 'number')
					throw 'Expected index to be of type "number"';

				return (args[0] as GSArray).value[args[1].value];
			})
		)
		.set(
			'length',
			DataConstructors.NATIVEFN((args, _scope) => {
				return DataConstructors.NUMBER(
					(args[0] as GSArray).value.length
				);
			})
		)
);

export const formatString = DataConstructors.NATIVEFN((args, _scope) => {
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

export const GSON = DataConstructors.OBJECT(
	new Map()
		.set(
			'toString',
			DataConstructors.NATIVEFN((args, _scope) => {
				return DataConstructors.STRING(
					JSON.stringify(getValue(args[0]))
				);
			})
		)
		.set(
			'toGSON',
			DataConstructors.NATIVEFN((args, _scope) => {
				console.warn(
					'GSExperimentalFunctionWarning: "GSON.toGSON()" is an experimental feature. Use at your own risk.'
				);
				return DataConstructors.OBJECT(
					objectToMap(JSON.parse(args[0].value))
				);
			})
		)
);
