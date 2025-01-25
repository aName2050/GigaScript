import { ClassDeclaration } from '../ast/class.ast';
import { GSAny } from '../runtime/types';

export interface GSModule {
	name: string;
	exports: Map<string, GSAny | ClassDeclaration>;
}
