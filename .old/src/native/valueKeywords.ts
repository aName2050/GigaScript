import { DataConstructors } from '../runtime/types';

export const TRUE = DataConstructors.BOOLEAN(true);
export const FALSE = DataConstructors.BOOLEAN(false);
export const NIL = DataConstructors.NULL();
export const UNDEFINED = DataConstructors.UNDEFINED();

// default value will be undefined
export const __ERROR = DataConstructors.UNDEFINED();
