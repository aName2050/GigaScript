import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError } from '../../typescript/GS.types';
import { Identifier } from '../ast/literals/literals.ast';
import { DataConstructors, GSAny } from './types';
import { TRUE, FALSE, NIL, UNDEFINED, __ERROR } from '../native/valueKeywords';

export function createNewGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	env.declareVariable({ symbol: 'true' } as Identifier, TRUE, true);
	env.declareVariable({ symbol: 'false' } as Identifier, FALSE, true);
	env.declareVariable({ symbol: 'nil' } as Identifier, NIL, true);
	env.declareVariable({ symbol: 'undefined' } as Identifier, UNDEFINED, true);
	env.declareVariable({ symbol: 'error' } as Identifier, __ERROR, true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, GSAny>;
	private constants: Set<string>;
	// classes
	public cwd: string;
	// exports

	constructor(currentWorkingDirectory: string, parentEnv?: Environment) {
		this.parent = parentEnv;

		this.variables = new Map();
		this.constants = new Set();
		// exports
		// classes

		this.cwd = currentWorkingDirectory;
	}

	// VARIABLES
	public get Variables(): Map<string, GSAny> {
		return this.variables;
	}

	public declareVariable(
		identifier: Identifier,
		value: GSAny,
		isConstant: boolean
	): GSAny {
		if (this.variables.has(identifier.symbol))
			throw new GSError(
				SpecialError.EvalError,
				`Cannot redeclare variable "${identifier.symbol}"`,
				`${SOURCE_FILE}:${identifier.start.Line}:${identifier.start.Column}`
			);

		this.variables.set(identifier.symbol, value);

		if (isConstant) this.constants.add(identifier.symbol);

		return value;
	}

	public assignVariable(
		identifier: Identifier,
		value: GSAny,
		overrideConstant = false
	): GSAny {
		if (identifier.symbol == 'this' && !this.parent && !overrideConstant) {
			throw new GSError(
				SpecialError.RuntimeError,
				'Cannot override "this" keyword',
				`${SOURCE_FILE}:${identifier.start.Line}:${identifier.start.Column}`
			);
		}

		const env = this.resolve(identifier);

		if (env.constants.has(identifier.symbol) && !overrideConstant)
			throw new GSError(
				SpecialError.EvalError,
				`Cannot reassign "${identifier.symbol}" because it is a constant`,
				`${SOURCE_FILE}:${identifier.start.Line}:${identifier.start.Column}`
			);

		env.variables.set(identifier.symbol, value);

		return value;
	}

	public lookupVar(identifier: Identifier): GSAny {
		if (identifier.symbol == 'this' && !this.parent) {
			return DataConstructors.UNDEFINED();
		}

		const env = this.resolve(identifier);
		return (
			env.variables.get(identifier.symbol) ?? DataConstructors.UNDEFINED()
		);
	}

	public resolve(identifier: Identifier): Environment {
		if (this.variables.has(identifier.symbol)) return this;
		if (this.parent == undefined)
			throw new GSError(
				SpecialError.EvalError,
				`Unable to resolve variable "${identifier.symbol}" as it doesn't exist`,
				`${SOURCE_FILE}:${identifier.start.Line}:${identifier.start.Column}`
			);

		return this.parent.resolve(identifier);
	}
}
