import { Stmt } from '../ast/ast';
import Environment from './environment';

export type ValueType =
    | 'null'
    | 'number'
    | 'boolean'
    | 'object'
    | 'nativeFunction'
    | 'function';

export interface RuntimeVal {
    type: ValueType;
}

/**
 * A value of no meaning
 */
export interface NullVal extends RuntimeVal {
    type: 'null';
    value: null;
}

export function MK_NULL() {
    return { type: 'null', value: null } as NullVal;
}

/**
 * Runtime value with direct access to the raw JavaScript boolean
 */
export interface BooleanVal extends RuntimeVal {
    type: 'boolean';
    value: boolean;
}

export function MK_BOOL(b = true) {
    return { type: 'boolean', value: b } as BooleanVal;
}

/**
 * Runtime value with direct access to the raw JavaScript number
 */
export interface NumberVal extends RuntimeVal {
    type: 'number';
    value: number;
}

export function MK_NUMBER(n = 0) {
    return { type: 'number', value: n } as NumberVal;
}

export interface ObjectVal extends RuntimeVal {
    type: 'object';
    properties: Map<string, RuntimeVal>;
}

/**
 * Runtime value for function calls
 */
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

/**
 * Runtime value for native functions
 */
export interface NativeFunctionVal extends RuntimeVal {
    type: 'nativeFunction';
    call: FunctionCall;
}

export function MK_NATIVE_FUNCTION(call: FunctionCall) {
    return { type: 'nativeFunction', call } as NativeFunctionVal;
}

export interface FunctionVal extends RuntimeVal {
    type: 'function';
    name: string;
    parameters: string[];
    declarationEnv: Environment;
    body: Stmt[];
}
