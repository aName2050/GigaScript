import { CodeBlockNode, STATEMENT } from '../ast/ast';
import Environment from './env';

export type DataType =
	| 'undefined'
	| 'null'
	| 'number'
	| 'string'
	| 'boolean'
	| 'object'
	| 'array'
	| 'nativeFn'
	| 'function'
	| 'class';

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

export interface GSUndefined extends Value<'undefined', undefined> {}
export interface GSNull extends Value<'null', null> {}
export interface GSNumber extends Value<'number', number> {}
export interface GSString extends Value<'string', string> {}
export interface GSBoolean extends Value<'boolean', boolean> {}
export interface GSObject extends ObjectValue {}
export interface GSArray extends Value<'array', Array<any>> {}
export interface GSNativeFn extends NativeFnVal {}
export interface GSFunction extends FuncVal {}

export interface GSAny extends Value<DataType, any> {}

function NULL(): Value<'null', null> {
	return { type: 'null', value: null } as Value<'null', null>;
}

function NUMBER(n = 0): Value<'number', number> {
	return { type: 'number', value: n } as Value<'number', number>;
}

function STRING(str: string): Value<'string', string> {
	return { type: 'string', value: str } as Value<'string', string>;
}

function BOOLEAN(b = false): Value<'boolean', boolean> {
	return { type: 'boolean', value: b } as Value<'boolean', boolean>;
}

export interface ObjectValue extends Value<'object', object> {
	type: 'object';
	properties: Map<string, GSAny>;
}

function OBJECT(
	obj: Map<string, Value<DataType, any>>
): Value<'object', object> {
	return { type: 'object', properties: obj } as GSObject;
}

function ARRAY(arr: Array<Value<DataType, any>>): GSArray {
	return { type: 'array', value: arr } as GSArray;
}

export type FunctionCall = (
	args: Array<GSAny>,
	env: Environment
) => Value<DataType, any>;

export interface NativeFnVal extends Value<'nativeFn', undefined> {
	type: 'nativeFn';
	call: FunctionCall;
}

function NATIVEFN(call: FunctionCall): NativeFnVal {
	return { type: 'nativeFn', call } as NativeFnVal;
}

export interface FuncVal extends Value<'function', undefined> {
	type: 'function';
	name: string;
	params: Array<string>;
	decEnv: Environment;
	body: CodeBlockNode;
}

export interface ClassVal extends Value<'class', undefined> {
	type: 'class';
	name: string;
	classEnv: Environment;
	instance: GSObject;
}

export const DataConstructors = {
	UNDEFINED,
	NULL,
	NUMBER,
	STRING,
	BOOLEAN,
	OBJECT,
	ARRAY,
	NATIVEFN,
};
