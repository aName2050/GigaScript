import { DataConstructors, GSAny, GSObject } from './types';
import * as NativeFunctions from '../native/functions';
import * as NativeValues from '../native/valueKeywords';
import { MemberExpr } from '../ast/expressions.ast';
import { Identifier } from '../ast/literals.ast';
import { ClassBody } from '../types';

export function createGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	// Native values
	env.declareVar('true', NativeValues.True, true);
	env.declareVar('false', NativeValues.False, true);
	env.declareVar('null', NativeValues.Null, true);
	env.declareVar('undefined', NativeValues.Undefined, true);

	// Native variables
	env.declareVar('error', NativeValues.Error, true);
	env.declareVar('this', DataConstructors.UNDEFINED(), true);

	// Native functions
	env.declareVar('print', NativeFunctions.print, true);
	env.declareVar(
		'generateTimestamp',
		NativeFunctions.generateTimestamp,
		true
	);
	env.declareVar('math', NativeFunctions.math, true);
	env.declareVar('formatString', NativeFunctions.formatString, true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, GSAny>;
	private constants: Set<string>;
	private classes: Map<string, ClassBody>;
	public cwd: string;
	private Exports: Map<string, GSAny>;

	constructor(currentWorkingDirectory: string, parentEnv?: Environment) {
		this.parent = parentEnv;

		this.variables = new Map();
		this.constants = new Set();
		this.Exports = new Map();
		this.classes = new Map();

		this.cwd = currentWorkingDirectory;
	}

	public addExport(identifier: string, value: GSAny): void {
		this.Exports.set(identifier, value);
		return;
	}

	public get exports(): Map<string, GSAny> {
		return this.Exports;
	}

	// VARIABLES

	public declareVar(
		identifier: string,
		value: GSAny,
		isConstant: boolean
	): GSAny {
		if (this.variables.has(identifier))
			throw `Cannot redeclare variable "${identifier}"`;

		this.variables.set(identifier, value);

		if (isConstant) this.constants.add(identifier);

		return value;
	}

	public assignVar(identifer: string, value: GSAny): GSAny {
		const env = this.resolve(identifer);

		if (env.constants.has(identifer))
			throw `Can not reassign "${identifer}" because it is a cosntant`;

		env.variables.set(identifer, value);

		return value;
	}

	public lookupVar(identifer: string): GSAny {
		const env = this.resolve(identifer);
		return env.variables.get(identifer) as GSAny;
	}

	public resolve(identifer: string): Environment {
		if (this.variables.has(identifer)) return this;
		if (this.parent == undefined)
			throw `Unable to resolve variable "${identifer}" as it doesn't exist`;

		return this.parent.resolve(identifer);
	}

	// OBJECTS

	public lookupObjectValue(expr: MemberExpr): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			const value = this.lookupObjectValue(expr.object as MemberExpr);

			if (value == undefined) {
				throw `Property "${
					expr.property.symbol
				}" does't exist on object "${
					(expr.object as Identifier).symbol
				}"`;
			}

			if (value.type == 'object')
				return (value as GSObject).properties.get(
					expr.property.symbol
				)!;
			else return value;
		}

		const varName = (expr.object as Identifier).symbol;
		const env = this.resolve(varName);

		let object = env.variables.get(varName) as GSObject;

		const prop = object.properties.get(expr.property.symbol);

		if (!prop)
			throw `Property ${expr.property.symbol} does not exist on object "${
				(expr.object as Identifier).symbol
			}"`;

		return prop;
	}

	public modifyObject(expr: MemberExpr, newValue: GSAny): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			let obj = this.getObject(expr.object as MemberExpr);

			if (obj.type == 'object') {
				(obj as GSObject).properties.set(
					expr.property.symbol,
					newValue
				);
			}

			return obj;
		}

		const objectIdentifer = (expr.object as Identifier).symbol;
		const env = this.resolve(objectIdentifer);

		const object = env.variables.get(objectIdentifer) as GSObject;

		object.properties.set(expr.property.symbol, newValue);

		return object;
	}

	private getObject(expr: MemberExpr): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			const value = this.lookupObjectValue(expr.object as MemberExpr);

			if (value == undefined) {
				throw `Property "${
					expr.property.symbol
				}" does't exist on object "${
					(expr.object as Identifier).symbol
				}"`;
			}

			if (value.type == 'object')
				return (value as GSObject).properties.get(
					expr.property.symbol
				)!;
		}

		const varName = (expr.object as Identifier).symbol;
		const env = this.resolve(varName);

		let object = env.variables.get(varName) as GSObject;

		const prop = object.properties.get(expr.property.symbol);

		if (!prop)
			throw `Property ${expr.property.symbol} does not exist on object "${
				(expr.object as Identifier).symbol
			}"`;

		return prop;
	}

	// CLASSES

	// TODO:
}
