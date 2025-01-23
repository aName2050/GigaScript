import { SOURCE_FILE } from '..';
import { SpecialError } from '../../typescript/Error.types';
import { GSError } from '../../typescript/GS.types';
import { Identifier } from '../ast/literals/literals.ast';
import { DataConstructors, GSAny } from './types';
import { TRUE, FALSE, NIL, UNDEFINED, __ERROR } from '../native/valueKeywords';
import * as NATIVE_FUNCTIONS from '../native/functions';

export function createNewGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	// Native values
	env.declareVariable({ symbol: 'true' } as Identifier, TRUE, true);
	env.declareVariable({ symbol: 'false' } as Identifier, FALSE, true);
	env.declareVariable({ symbol: 'nil' } as Identifier, NIL, true);
	env.declareVariable({ symbol: 'undefined' } as Identifier, UNDEFINED, true);
	env.declareVariable({ symbol: 'error' } as Identifier, __ERROR, true);

	// native variables
	// TODO: error

	// Native functions
	env.declareVariable(
		{ symbol: 'print' } as Identifier,
		NATIVE_FUNCTIONS.print,
		true
	);

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

	// OBJECTS
	public lookupObjectValue(expr: MemberExpr): GSAny {}

	// public lookupObjectValue(expr: MemberExpr): GSAny {
	// 	if (expr.object.kind == 'MemberExpr') {
	// 		const value = this.lookupObjectValue(expr.object as MemberExpr);
	// 		const property: string = expr.computed
	// 			? evaluate(expr.property, this).value
	// 			: (expr.property as Identifier).symbol;

	// 		if (value == undefined) {
	// 			throw `EvalError: Property "${property}" does't exist on object "${
	// 				(expr.object as Identifier).symbol
	// 			}"`;
	// 		}

	// 		if (value.type == 'object')
	// 			return (value as GSObject).properties.get(property)!;
	// 		else return value;
	// 	}

	// 	const varName = (expr.object as Identifier).symbol;
	// 	const env = this.resolve(varName);

	// 	const property: string = expr.computed
	// 		? evaluate(expr.property, env).value
	// 		: (expr.property as Identifier).symbol;

	// 	let object = env.variables.get(varName) as GSObject;

	// 	const prop = object.properties.get(property);

	// 	if (!prop)
	// 		throw `EvalError: Property ${property} does not exist on object "${
	// 			(expr.object as Identifier).symbol
	// 		}"`;

	// 	return prop;
	// }

	// public modifyObject(expr: MemberExpr, newValue: GSAny): GSAny {
	// 	if (expr.object.kind == 'MemberExpr') {
	// 		const obj = this.getObject(expr.object as MemberExpr);
	// 		const property: string = expr.computed
	// 			? evaluate(expr.property, this).value
	// 			: (expr.property as Identifier).symbol;

	// 		if (obj.type == 'object') {
	// 			(obj as GSObject).properties.set(property, newValue);
	// 		}

	// 		return obj;
	// 	}

	// 	const objectIdentifer = (expr.object as Identifier).symbol;
	// 	const env = this.resolve(objectIdentifer);

	// 	const object = env.variables.get(objectIdentifer) as GSObject;
	// 	const property: string = expr.computed
	// 		? evaluate(expr.property, env).value
	// 		: (expr.property as Identifier).symbol;

	// 	object.properties.set(property, newValue);

	// 	return object;
	// }

	// private getObject(expr: MemberExpr): GSAny {
	// 	if (expr.object.kind == 'MemberExpr') {
	// 		const value = this.lookupObjectValue(expr.object as MemberExpr);
	// 		const property: string = expr.computed
	// 			? evaluate(expr.property, this).value
	// 			: (expr.property as Identifier).symbol;

	// 		if (value == undefined) {
	// 			throw `EvalError: Property "${property}" does't exist on object "${
	// 				(expr.object as Identifier).symbol
	// 			}"`;
	// 		}

	// 		if (value.type == 'object')
	// 			return (value as GSObject).properties.get(property)!;
	// 	}

	// 	const varName = (expr.object as Identifier).symbol;
	// 	const env = this.resolve(varName);

	// 	let object = env.variables.get(varName) as GSObject;
	// 	const property: string = expr.computed
	// 		? evaluate(expr.property, env).value
	// 		: (expr.property as Identifier).symbol;

	// 	const prop = object.properties.get(property);

	// 	if (!prop)
	// 		throw `EvalError: Property ${property} does not exist on object "${
	// 			(expr.object as Identifier).symbol
	// 		}"`;

	// 	return prop;
	// }
}
