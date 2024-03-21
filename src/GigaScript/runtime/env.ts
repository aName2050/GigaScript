import { Value, DataConstructors, DataType, ObjectValue } from './types';
import * as NativeFunctions from '../native/functions';
import * as NativeValues from '../native/valueKeywords';
import { MemberExpr } from '../ast/expressions.ast';
import { Identifier } from '../ast/literals.ast';

export function createGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	// Native values
	env.delcareVar('true', NativeValues.True, true);
	env.delcareVar('false', NativeValues.False, true);
	env.delcareVar('null', NativeValues.Null, true);
	env.delcareVar('undefined', NativeValues.Undefined, true);

	// Native variables
	env.delcareVar('error', NativeValues.Error, true);

	// Native functions
	env.delcareVar('print', NativeFunctions.print, true);
	env.delcareVar(
		'generateTimestamp',
		NativeFunctions.generateTimestamp,
		true
	);
	env.delcareVar('math', NativeFunctions.math, true);
	env.delcareVar('formatString', NativeFunctions.formatString, true);

	return env;
}

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

	// VARIABLES

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

	public lookupVar(identifer: string): Value<DataType, any> {
		const env = this.resolve(identifer);
		return env.variables.get(identifer) as Value<DataType, any>;
	}

	public resolve(identifer: string): Environment {
		if (this.variables.has(identifer)) return this;
		if (this.parent == undefined)
			throw `Unable to resolve variable "${identifer}" as it doesn't exist`;

		return this.parent.resolve(identifer);
	}

	// Objects

	public lookupOrModifyObject(
		expr: MemberExpr,
		value?: Value<DataType, any>,
		property?: Identifier
	): Value<DataType, any> {
		if (expr.object.kind === 'MemberExpr')
			return this.lookupOrModifyObject(
				expr.object as MemberExpr,
				value,
				expr.property as Identifier
			);

		const varName = (expr.object as Identifier).symbol;
		const env = this.resolve(varName);

		let oldVal = env.variables.get(varName) as ObjectValue;

		const prop = property
			? property.symbol
			: (expr.property as Identifier).symbol;
		const currProp = (expr.property as Identifier).symbol;

		if (value) oldVal.properties.set(prop, value);

		if (currProp) oldVal = oldVal.properties.get(currProp) as ObjectValue;

		return oldVal;
	}
}
