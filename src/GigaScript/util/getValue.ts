import { DataType, FuncVal, GSObject, Value } from '../runtime/types';

export function getValue(
	value: Value<DataType, any>
): number | boolean | null | undefined | string | object | Array<any> {
	switch (value?.type) {
		case 'number':
			return (value as Value<'number', number>).value;
		case 'string':
			return (value as Value<'string', string>).value;
		case 'boolean':
			return (value as Value<'boolean', boolean>).value;
		case 'null':
			return (value as Value<'null', null>).value;
		case 'undefined':
			return (value as Value<'undefined', undefined>).value;
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

		default:
			return value;
	}
}
