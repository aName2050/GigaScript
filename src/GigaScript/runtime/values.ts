export type ValueType = 'null' | 'number';

export interface RuntimeVal {
    type: ValueType;
}

/**
 * A value of no meaning
 */
export interface NullVal extends RuntimeVal {
    type: 'null';
    value: 'null';
}

/**
 * Runtime value with direct access to the raw JavaScript number
 */
export interface NumberVal extends RuntimeVal {
    type: 'number';
    value: number;
}
