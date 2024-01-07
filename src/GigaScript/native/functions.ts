import {
    BooleanValue,
    FunctionValue,
    NATIVE_FUNCTION,
    NULL,
    NUMBER,
    NullValue,
    NumberValue,
    OBJECT,
    ObjectValue,
    RuntimeValue,
} from '../runtime/values';
import { getValue } from '../util/util';

export const print = NATIVE_FUNCTION((args, scope) => {
    const output: any[] = [];

    for (const arg of args) {
        output.push(getValue(arg));
    }

    console.log(...output);

    return NULL();
});

export const timestamp = NATIVE_FUNCTION((args, scope) => {
    return NUMBER(Date.now());
});

export const math = OBJECT(
    new Map()
        .set(
            'pi',
            NATIVE_FUNCTION((_args, _scope) => {
                return NUMBER(Math.PI);
            })
        )
        .set(
            'sqrt',
            NATIVE_FUNCTION((args, _scope) => {
                const num = (args[0] as NumberValue).value;
                return NUMBER(Math.sqrt(num));
            })
        )
);
