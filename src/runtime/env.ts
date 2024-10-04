import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError } from '../../typescript/GS.types';
import { Identifer } from '../ast/literals/literals.ast';
import { GSAny } from './types';

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

	public declareVar(
		identifier: Identifer,
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
}
