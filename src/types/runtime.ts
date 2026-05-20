export type DataType = 'number';

export interface Value<DataType, Type> {
	type: DataType;
	value: Type;
}
