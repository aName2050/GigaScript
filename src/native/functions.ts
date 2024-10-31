import { DataConstructors } from '../runtime/types';
import { getValue } from '../util/getValue';

export const print = DataConstructors.NATIVEFN((args, scope) => {
	const output: any[] = [];

	for (const arg of args) {
		output.push(getValue(arg));
	}

	console.log(...output);

	return DataConstructors.NULL();
});
