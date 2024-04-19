import { GSAny, GSObject } from '../runtime/types';

export interface GSModule {
	name: string;
	exports: Map<string, GSAny>;
}
