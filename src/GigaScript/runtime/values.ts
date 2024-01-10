import { Stmt } from '../ast/ast';
import Environment from './environment';

export type ValueType =
    | 'undefined'
    | 'NaN'
    | 'null'
    | 'number'
    | 'string'
    | 'boolean'
    | 'object'
    | 'nativeFunction'
    | 'function';

export interface RuntimeValue {
    type: ValueType;
}

/**
 * A value of no meaning
 */
export interface NullValue extends RuntimeValue {
    type: 'null';
    value: null;
}

export function NULL() {
    return { type: 'null', value: null } as NullValue;
}

export interface UndefinedValue extends RuntimeValue {
    type: 'undefined';
    value: undefined;
}

export function UNDEFINED() {
    return { type: 'undefined', value: undefined } as UndefinedValue;
}

export interface NaNValue extends RuntimeValue {
    type: 'NaN';
    value: 'NaN';
}

export function NaN() {
    return { type: 'NaN', value: 'NaN' } as NaNValue;
}

/**
 * Runtime value with direct access to the raw JavaScript boolean
 */
export interface BooleanValue extends RuntimeValue {
    type: 'boolean';
    value: boolean;
}

export function BOOL(b = true) {
    return { type: 'boolean', value: b } as BooleanValue;
}

/**
 * Runtime value with direct access to the raw JavaScript number
 */
export interface NumberValue extends RuntimeValue {
    type: 'number';
    value: number;
}

export function NUMBER(n = 0) {
    return { type: 'number', value: n } as NumberValue;
}

/**
 * Runtime value with direct access to the raw JavaScript string
 */
export interface StringValue extends RuntimeValue {
    type: 'string';
    value: string;
}

export function STRING(str: string) {
    return { type: 'string', value: str } as StringValue;
}

export interface ObjectValue extends RuntimeValue {
    type: 'object';
    properties: Map<string, RuntimeValue>;
}

export function OBJECT(obj: Map<string, RuntimeValue>) {
    return { type: 'object', properties: obj } as ObjectValue;
}

/**
 * Runtime value for function calls
 */
export type FunctionCall = (
    args: RuntimeValue[],
    env: Environment
) => RuntimeValue;

/**
 * Runtime value for native functions
 */
export interface NativeFunctionValue extends RuntimeValue {
    type: 'nativeFunction';
    call: FunctionCall;
}

export function NATIVE_FUNCTION(call: FunctionCall) {
    return { type: 'nativeFunction', call } as NativeFunctionValue;
}

export interface FunctionValue extends RuntimeValue {
    type: 'function';
    name: string;
    parameters: string[];
    declarationEnv: Environment;
    body: Stmt[];
}
