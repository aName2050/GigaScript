export type ValueType = 'null' | 'number' | 'boolean';

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
