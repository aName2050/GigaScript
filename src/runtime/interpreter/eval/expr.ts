import { Identifier } from '../../../ast/literals/literals.ast';
import Environment from '../../env';
import { GSAny } from '../../types';

export function evalIdentifier(
	identifier: Identifier,
	env: Environment
): GSAny {
	const val = env.lookupVar(identifier);
	return val;
}
