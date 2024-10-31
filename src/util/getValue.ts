import {
	GSAny,
	GSBoolean,
	GSFunction,
	GSNativeFn,
	GSNil,
	GSNumber,
	GSString,
	GSUndefined,
} from '../runtime/types';

export function getValue(
	value: GSAny
): number | boolean | null | undefined | string | object | Array<any> {
	switch (value?.type) {
		case 'number':
			return (value as GSNumber).value;
		case 'string':
			return (value as GSString).value;
		case 'boolean':
			return (value as GSBoolean).value;
		case 'nil':
			return (value as GSNil).value;
		case 'undefined':
			return (value as GSUndefined).value;
		case 'Function':
			const fn = value as GSFunction;

			return {
				name: fn.name,
				body: fn.body.body,
				isNative: false,
			};
		case 'nativeFn':
			return {
				name: 'nativeFn',
				isNative: true,
			};
		default:
			return value;
	}
}
