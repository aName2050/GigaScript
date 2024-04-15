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

function NULL(): GSNull {
	return { type: 'null', value: null } as GSNull;
}

function NUMBER(n = 0): GSNumber {
	return { type: 'number', value: n } as GSNumber;
}

function STRING(str: string): GSString {
	return { type: 'string', value: str } as GSString;
}

function BOOLEAN(b = false): GSBoolean {
	return { type: 'boolean', value: b } as GSBoolean;
}

export interface ObjectValue extends Value<'object', object> {
	type: 'object';
	properties: Map<string, GSAny>;
}

function OBJECT(obj: Map<string, Value<DataType, any>>): GSObject {
	return { type: 'object', properties: obj } as GSObject;
}

function ARRAY(arr: Array<Value<DataType, any>>): GSArray {
	return { type: 'array', value: arr } as GSArray;
}

export type FunctionCall = (args: Array<GSAny>, env: Environment) => GSAny;

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
