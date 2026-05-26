export type DataType = 'number';

export interface Value<DataType, Type> {
	type: DataType;
	value: Type;
}

export interface _NUMBER extends Value<'number', number> {}

export function NUMBER(n = 0): _NUMBER {
	return { type: 'number', value: n } as _NUMBER;
}

export const DataConstructors = {
	NUMBER,
};
