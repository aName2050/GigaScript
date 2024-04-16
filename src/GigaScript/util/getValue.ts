import {
	FuncVal,
	GSAny,
	GSArray,
	GSBoolean,
	GSNull,
	GSNumber,
	GSObject,
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
		case 'null':
			return (value as GSNull).value;
		case 'undefined':
			return (value as GSUndefined).value;
		case 'object':
			let obj: { [key: string]: any } = {};
			const aObj = value as GSObject;
			aObj.properties.forEach((val, key) => {
				obj[key] = getValue(val);
			});

			return obj;
		case 'function':
			const fn = value as FuncVal;

			return {
				name: fn.name,
				body: fn.body,
				isNative: false,
			};
		case 'array':
			let arr: Array<any> = [];

			const aArr = value as GSArray;
			aArr.value.forEach(val => {
				arr.push(getValue(val));
			});

			return arr;

		default:
			return value;
	}
}
