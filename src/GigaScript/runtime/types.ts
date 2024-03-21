import { STATEMENT } from '../ast/ast';

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

function UNDEFINED(): Value<'undefined', undefined> {
	return { type: 'undefined', value: undefined } as Value<
		'undefined',
		undefined
	>;
}

function NULL(): Value<'null', null> {
	return { type: 'null', value: null } as Value<'null', null>;
}

function NUMBER(n = 0): Value<'number', number> {
	return { type: 'number', value: n } as Value<'number', number>;
}

function BOOLEAN(b = false): Value<'boolean', boolean> {
	return { type: 'boolean', value: b } as Value<'boolean', boolean>;
}

function OBJECT(
	obj: Map<string, Value<DataType, any>>
): Value<'object', object> {
	return { type: 'object', value: obj } as Value<'object', object>;
}

function ARRAY(arr: Array<Value<DataType, any>>): Value<'array', Array<any>> {
	return { type: 'array', value: arr } as Value<'array', Array<any>>;
}

export type FunctionCall = (
	args: Array<Value<DataType, any>>
	// env: Environment
) => Value<DataType, any>;

export interface NativeFnVal {
	type: 'nativeFn';
	call: FunctionCall;
}

function NATIVEFN(call: FunctionCall): NativeFnVal {
	return { type: 'nativeFn', call } as NativeFnVal;
}

export interface FuncVal {
	type: 'function';
	name: string;
	params: Array<string>;
	// decEnv: Environment;
	body: Array<STATEMENT>;
}

export const DataConstructors = {
	UNDEFINED,
	NULL,
	NUMBER,
	BOOLEAN,
	OBJECT,
	ARRAY,
	NATIVEFN,
};
