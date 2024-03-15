export type DataType =
	| 'undefined'
	| 'null'
	| 'number'
	| 'string'
	| 'boolean'
	| 'object'
	| 'array'
	| 'nativeFn'
	| 'function';

export interface Value<DataType, Type> {
	type: DataType;
	value: Type;
}

export function UNDEFINED(): Value<'undefined', undefined> {
	return { type: 'undefined', value: undefined } as Value<
		'undefined',
		undefined
	>;
}

export function NULL(): Value<'null', null> {
	return { type: 'null', value: null } as Value<'null', null>;
}

export function NUMBER(n = 0): Value<'number', number> {
	return { type: 'number', value: n } as Value<'number', number>;
}
