import { CodeBlockNode } from '../ast/ast';

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

export interface GSString extends Value<'string', string> {}
export interface GSNumber extends Value<'number', number> {}
export interface GSBoolean extends Value<'boolean', boolean> {}
export interface GSNil extends Value<'nil', null> {}
export interface GSObject extends ObjectValue {}
// export interface GSFunction extends
export interface GSAny extends Value<'any', any> {}
export interface GSUndefined extends Value<'undefined', undefined> {}

function UNDEFINED(): Value<'undefined', undefined> {
	return { type: 'undefined', value: undefined } as GSUndefined;
}

function STRING(str: string): GSString {
	return { type: 'string', value: str } as GSString;
}

function NUMBER(n = 0): GSNumber {
	return { type: 'number', value: n } as GSNumber;
}
