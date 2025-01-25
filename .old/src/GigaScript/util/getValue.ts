import {
	ClassVal,
	GSAny,
	GSArray,
	GSBoolean,
	GSFunction,
	GSNativeFn,
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
			const fn = value as GSFunction;

			return {
				name: fn.name,
				body: fn.body.body,
				isNative: false,
			};

		case 'class':
			const Class = value as ClassVal;

			return {
				name: Class.name,
				instance: Class.instance,
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
