import { Value, DataConstructors, DataType } from './types';
import * as NativeFunctions from '../native/functions';
import * as NativeValues from '../native/valueKeywords';

// export function createGlobalScope(cwd: string)

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, Value<DataType, any>>;
	private constants: Set<string>;
	// TODO: implement classes
	// private classes: Map<string, Class>;
	public cwd: string;
	public Exports: Map<string, Value<DataType, any>>;

	constructor(currentWorkingDirectory: string, parentEnv?: Environment) {
		this.parent = parentEnv;

		this.variables = new Map();
		this.constants = new Set();
		this.Exports = new Map();
		// this.classes = new Map();

		this.cwd = currentWorkingDirectory;
	}

	public addExport(identifier: string, value: Value<DataType, any>): void {
		this.Exports.set(identifier, value);
		return;
	}

	public get exports(): Map<string, Value<DataType, any>> {
		return this.Exports;
	}

	public delcareVar(
		identifier: string,
		value: Value<DataType, any>,
		isConstant: boolean
	): Value<DataType, any> {
		if (this.variables.has(identifier))
			throw `Cannot redeclare variable "${identifier}"`;

		this.variables.set(identifier, value);

		if (isConstant) this.constants.add(identifier);

		return value;
	}

	public assignVar(
		identifer: string,
		value: Value<DataType, any>
	): Value<DataType, any> {
		const env = this.resolve(identifer);

		if (env.constants.has(identifer))
			throw `Can not reassign "${identifer}" because it is a cosntant`;

		env.variables.set(identifer, value);

		return value;
	}

	public resolve(identifer: string): Environment {
		if (this.variables.has(identifer)) return this;
		if (this.parent == undefined)
			throw `Unable to resolve variable "${identifer}" as it doesn't exist`;

		return this.parent.resolve(identifer);
	}
}
