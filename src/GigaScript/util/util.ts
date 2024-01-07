import {
    RuntimeValue,
    NumberValue,
    BooleanValue,
    NullValue,
    ObjectValue,
    FunctionValue,
} from '../runtime/values';

export function getValue(
    runtimeVal: RuntimeValue
): number | boolean | null | object {
    switch (runtimeVal.type) {
        case 'number':
            return (runtimeVal as NumberValue).value;
        case 'boolean':
            return (runtimeVal as BooleanValue).value;
        case 'null':
            return (runtimeVal as NullValue).value;
        case 'object':
            let obj: { [key: string]: any } = {};
            const aObj = runtimeVal as ObjectValue;
            aObj.properties.forEach((value, key) => {
                obj[key] = getValue(value);
            });
            return obj;
        case 'function':
            const fn = runtimeVal as FunctionValue;

            return {
                name: fn.name,
                body: fn.body,
                native: false,
            };

        default:
            return runtimeVal;
    }
}
