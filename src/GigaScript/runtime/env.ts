import {
	ClassVal,
	DataConstructors,
	FuncVal,
	GSAny,
	GSObject,
	GSString,
} from './types';
import * as NativeFunctions from '../native/functions';
import * as NativeValues from '../native/valueKeywords';
import { MemberExpr } from '../ast/expressions.ast';
import { Identifier } from '../ast/literals.ast';
import { ClassBody } from '../types';
import {
	ClassDeclaration,
	ClassMethod,
	ClassProperty,
	ConstructorStatement,
} from '../ast/class.ast';
import { evaluate } from './interpreter/interpreter';
import { STATEMENT } from '../ast/ast';
import { sourceFile } from '../../index';

export function createGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	const isGSXFile = sourceFile?.endsWith('.gsx');

	// Native values
	env.declareVar(isGSXFile ? 'nocap' : 'true', NativeValues.True, true);
	env.declareVar(isGSXFile ? 'cap' : 'false', NativeValues.False, true);
	env.declareVar(isGSXFile ? 'fake' : 'null', NativeValues.Null, true);
	env.declareVar(
		isGSXFile ? 'undefined' : 'undefined',
		NativeValues.Undefined,
		true
	);

	// Native variables
	env.declareVar(isGSXFile ? 'whoops' : 'error', NativeValues.Error, true);

	// Native functions
	env.declareVar(isGSXFile ? 'yap' : 'print', NativeFunctions.print, true);
	env.declareVar(
		'generateTimestamp',
		NativeFunctions.generateTimestamp,
		true
	);
	env.declareVar(isGSXFile ? 'nerd' : 'math', NativeFunctions.math, true);
	env.declareVar('formatString', NativeFunctions.formatString, true);
	env.declareVar('Array', NativeFunctions.Array, true);
	env.declareVar('GSON', NativeFunctions.GSON, true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, GSAny>;
	private constants: Set<string>;
	private classes: Map<string, ClassBody>;
	public cwd: string;
	private Exports: Map<string, GSAny | ClassDeclaration>;

	constructor(currentWorkingDirectory: string, parentEnv?: Environment) {
		this.parent = parentEnv;

		this.variables = new Map();
		this.constants = new Set();
		this.Exports = new Map();
		this.classes = new Map();

		this.cwd = currentWorkingDirectory;
	}

	public addExport(
		identifier: string,
		value: GSAny | ClassDeclaration
	): void {
		this.Exports.set(identifier, value);
		return;
	}

	public get exports(): Map<string, GSAny | ClassDeclaration> {
		return this.Exports;
	}

	// VARIABLES

	public get Variables(): Map<string, GSAny> {
		return this.variables;
	}

	public declareVar(
		identifier: string,
		value: GSAny,
		isConstant: boolean
	): GSAny {
		if (this.variables.has(identifier))
			throw `EvalError: Cannot redeclare variable "${identifier}"`;

		this.variables.set(identifier, value);

		if (isConstant) this.constants.add(identifier);

		return value;
	}

	public assignVar(
		identifer: string,
		value: GSAny,
		overrideConstant = false
	): GSAny {
		if (identifer == 'this' && !this.parent && !overrideConstant) {
			throw 'RuntimeError: Cannot assign values to "this" keyword';
		}

		const env = this.resolve(identifer);

		if (env.constants.has(identifer) && !overrideConstant)
			throw `EvalError: Can not reassign "${identifer}" because it is a cosntant`;

		env.variables.set(identifer, value);

		return value;
	}

	public lookupVar(identifier: string): GSAny {
		if (identifier == 'this' && !this.parent) {
			return DataConstructors.UNDEFINED();
		}

		const env = this.resolve(identifier);
		return env.variables.get(identifier) as GSAny;
	}

	public resolve(identifer: string): Environment {
		if (this.variables.has(identifer)) return this;
		if (this.parent == undefined)
			throw `EvalError: Unable to resolve variable "${identifer}" as it doesn't exist`;

		return this.parent.resolve(identifer);
	}

	// OBJECTS

	public lookupObjectValue(expr: MemberExpr): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			const value = this.lookupObjectValue(expr.object as MemberExpr);
			const property: string = expr.computed
				? evaluate(expr.property, this).value
				: (expr.property as Identifier).symbol;

			if (value == undefined) {
				throw `EvalError: Property "${property}" does't exist on object "${
					(expr.object as Identifier).symbol
				}"`;
			}

			if (value.type == 'object')
				return (value as GSObject).properties.get(property)!;
			else return value;
		}

		const varName = (expr.object as Identifier).symbol;
		const env = this.resolve(varName);

		const property: string = expr.computed
			? evaluate(expr.property, env).value
			: (expr.property as Identifier).symbol;

		let object = env.variables.get(varName) as GSObject;

		const prop = object.properties.get(property);

		if (!prop)
			throw `EvalError: Property ${property} does not exist on object "${
				(expr.object as Identifier).symbol
			}"`;

		return prop;
	}

	public modifyObject(expr: MemberExpr, newValue: GSAny): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			const obj = this.getObject(expr.object as MemberExpr);
			const property: string = expr.computed
				? evaluate(expr.property, this).value
				: (expr.property as Identifier).symbol;

			if (obj.type == 'object') {
				(obj as GSObject).properties.set(property, newValue);
			}

			return obj;
		}

		const objectIdentifer = (expr.object as Identifier).symbol;
		const env = this.resolve(objectIdentifer);

		const object = env.variables.get(objectIdentifer) as GSObject;
		const property: string = expr.computed
			? evaluate(expr.property, env).value
			: (expr.property as Identifier).symbol;

		object.properties.set(property, newValue);

		return object;
	}

	private getObject(expr: MemberExpr): GSAny {
		if (expr.object.kind == 'MemberExpr') {
			const value = this.lookupObjectValue(expr.object as MemberExpr);
			const property: string = expr.computed
				? evaluate(expr.property, this).value
				: (expr.property as Identifier).symbol;

			if (value == undefined) {
				throw `EvalError: Property "${property}" does't exist on object "${
					(expr.object as Identifier).symbol
				}"`;
			}

			if (value.type == 'object')
				return (value as GSObject).properties.get(property)!;
		}

		const varName = (expr.object as Identifier).symbol;
		const env = this.resolve(varName);

		let object = env.variables.get(varName) as GSObject;
		const property: string = expr.computed
			? evaluate(expr.property, env).value
			: (expr.property as Identifier).symbol;

		const prop = object.properties.get(property);

		if (!prop)
			throw `EvalError: Property ${property} does not exist on object "${
				(expr.object as Identifier).symbol
			}"`;

		return prop;
	}

	// CLASSES

	public declareClass(
		name: string,
		properties: Array<ClassProperty>,
		methods: Array<ClassMethod>,
		constructor?: ConstructorStatement
	): GSAny {
		this.classes.set(name, {
			properties,
			methods,
			constructor,
		} as ClassBody);

		return DataConstructors.NULL();
	}

	public getClassAsObjectLiteral(name: string): ClassVal {
		const Class = this.classes.get(name);
		if (!Class) throw `RuntimeError: class "${name}" does not exist`;

		const { properties, methods, constructor } = Class;

		const obj = {
			type: 'object',
			properties: new Map<string, GSAny>(),
		} as GSObject;

		properties.forEach(prop => {
			if (prop.public) {
				const propVal = prop.value
					? evaluate(prop.value as STATEMENT, this as Environment)
					: DataConstructors.UNDEFINED();

				obj.properties.set(prop.identifier, propVal);
			}
		});

		const classEnv = new Environment(this.cwd, this as Environment);

		methods.forEach(method => {
			if (method.public) {
				const func = {
					type: 'function',
					name: method.name,
					params: method.params,
					decEnv: classEnv,
					body: method.body,
				} as FuncVal;

				obj.properties.set(method.name, func);
			}
		});

		if (constructor) {
			const constructorFunc = {
				type: 'function',
				name: 'constructor',
				params: constructor.params,
				body: constructor.body,
				decEnv: classEnv,
			} as FuncVal;

			obj.properties.set('constructor', constructorFunc);
		}

		return {
			type: 'class',
			name,
			classEnv,
			instance: obj,
		} as ClassVal;
	}

	public getAllClassMethodsAndProperties(name: string): ClassVal {
		const Class = this.classes.get(name);
		if (!Class) throw `RuntimeError: class "${name}" does not exist`;

		const { properties, methods, constructor } = Class;

		const obj = {
			type: 'object',
			properties: new Map<string, GSAny>(),
		} as GSObject;

		properties.forEach(prop => {
			const propVal = prop.value
				? evaluate(prop.value as STATEMENT, this as Environment)
				: DataConstructors.UNDEFINED();

			obj.properties.set(prop.identifier, propVal);
		});

		const classEnv = new Environment(this.cwd, this as Environment);

		methods.forEach(method => {
			const func = {
				type: 'function',
				name: method.name,
				params: method.params,
				decEnv: classEnv,
				body: method.body,
			} as FuncVal;

			obj.properties.set(method.name, func);
		});

		if (constructor) {
			const constructorFunc = {
				type: 'function',
				name: 'constructor',
				params: constructor.params,
				body: constructor.body,
				decEnv: classEnv,
			} as FuncVal;

			obj.properties.set('constructor', constructorFunc);
		}

		return {
			type: 'class',
			name,
			classEnv,
			instance: obj,
		} as ClassVal;
	}
}
