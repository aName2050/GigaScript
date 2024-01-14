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
    STRING,
    StringValue,
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
    new Map().set('pi', NUMBER(Math.PI)).set(
        'sqrt',
        NATIVE_FUNCTION((args, _scope) => {
            const num = (args[0] as NumberValue).value;
            return NUMBER(Math.sqrt(num));
        })
    )
);

export const format = NATIVE_FUNCTION((args, scope) => {
    const str = args.shift() as StringValue;

    let res = '';

    for (let i = 0; i < args.length; i++) {
        const arg = args[i] as StringValue;

        res = str.value.replace(/\${}/, arg.value);
    }

    if (!args[0]) throw '"format" expected 2 arguments, but got 1.';

    return STRING(res);
});
