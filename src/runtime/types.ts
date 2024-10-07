import { CodeBlockNode } from '../ast/ast';
import Environment from './env';

export type DataType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'nil'
	| 'object'
	| 'Function'
	| 'Array'
	| 'Class'
	| 'any'
	| 'undefined'
	| 'nativeFn';

export interface Value<DataType, Type> {
	type: DataType;
	value: Type;
}

export interface ObjectValue extends Value<'object', object> {
	type: 'object';
	properties: Map<string, GSAny>;
}

export type FunctionCall = (args: GSAny[], env: Environment) => GSAny;
// export interface NativeFunction

export interface GSString extends Value<'string', string> {}
export interface GSNumber extends Value<'number', number> {}
export interface GSBoolean extends Value<'boolean', boolean> {}
export interface GSNil extends Value<'nil', null> {}
export interface GSObject extends ObjectValue {}
// export interface GSFunction extends
export interface GSAny extends Value<'any' | DataType, any> {}
export interface GSUndefined extends Value<'undefined', undefined> {}

function STRING(str: string): GSString {
	return { type: 'string', value: str } as GSString;
}

function NUMBER(n = 0): GSNumber {
	return { type: 'number', value: n } as GSNumber;
}

function BOOLEAN(b = false): GSBoolean {
	return { type: 'boolean', value: b } as GSBoolean;
}

function NULL(): GSNil {
	return { type: 'nil', value: null } as GSNil;
}

function OBJECT(obj: Map<string, GSAny>): GSObject {
	return { type: 'object', properties: obj } as GSObject;
}

function UNDEFINED(): Value<'undefined', undefined> {
	return { type: 'undefined', value: undefined } as GSUndefined;
}

export const DataConstructors = {
	UNDEFINED,
	STRING,
	NUMBER,
};
