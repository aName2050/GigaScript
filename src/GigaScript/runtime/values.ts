import { Stmt } from '../ast/ast';
import Environment from './environment';

export type ValueType =
    | 'null'
    | 'number'
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
