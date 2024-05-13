import { DataConstructors } from '../runtime/types';

export const True = DataConstructors.BOOLEAN(true);
export const False = DataConstructors.BOOLEAN(false);
export const Null = DataConstructors.NULL();
export const Undefined = DataConstructors.UNDEFINED();

export const Error = DataConstructors.NULL(); // null is default value
