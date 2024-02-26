import {
	BOOL,
	NATIVE_FUNCTION,
	NULL,
	NUMBER,
	ObjectValue,
	RuntimeValue,
	STRING,
	UNDEFINED,
} from './values';
import * as NativeFunctions from '../native/functions';
import {
	ClassMethod,
	ClassProperty,
	Identifier,
	MemberExpr,
	ObjectLiteral,
} from '../ast/ast';
import { Class } from '../types';

/**
 * Create the default global environment
 */
export function createGlobalScope(cwd: string): Environment {
	const env = new Environment(cwd);

	// Global Variables
	env.delcareVar('true', BOOL(true), true);
	env.delcareVar('false', BOOL(false), true);
	env.delcareVar('null', NULL(), true);
	env.delcareVar('undefined', UNDEFINED(), true);

	env.delcareVar('error', NULL(), false);

	// Native functions
	env.delcareVar('print', NativeFunctions.print, true);
	env.delcareVar('timestamp', NativeFunctions.timestamp, true);
	env.delcareVar('math', NativeFunctions.math, true);
	env.delcareVar('format', NativeFunctions.format, true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, RuntimeValue>;
	private constants: Set<string>;
	public cwd: string;
	public exports: Map<string, RuntimeValue>;
	private classes: Map<string, Class>;

	constructor(currDir: string, parentEnv?: Environment) {
		this.parent = parentEnv;
		this.cwd = currDir;

		this.variables = new Map();
		this.constants = new Set();
		this.exports = new Map();
		this.classes = new Map();
	}

	public declareClass(
		className: string,
		properties: Array<ClassProperty>,
		methods: Array<ClassMethod>
	): RuntimeValue {
		if (this.classes.has(className))
			throw `Cannot redeclare class "${className}".`;

		this.classes.set(className, { properties, methods } as Class);

		console.log(this.classes);

		return NULL();
	}

	public addExportedValue(identifier: string, value: RuntimeValue): void {
		this.exports.set(identifier, value);
		return;
	}

	public getExportedValues(): Map<string, RuntimeValue> {
		return this.exports;
	}

	public delcareVar(
		varName: string,
		value: RuntimeValue,
		constant: boolean
	): RuntimeValue {
		if (this.variables.has(varName))
			throw `Cannot redeclare variable "${varName}".`;

		this.variables.set(varName, value);
		if (constant) {
			this.constants.add(varName);
		}
		return value;
	}

	public assignVar(varName: string, value: RuntimeValue): RuntimeValue {
		const env = this.resolve(varName);

		if (env.constants.has(varName)) {
			throw `Cannot not reassign "${varName}" because it is a constant.`;
		}

		env.variables.set(varName, value);
		return value;
	}

	public lookupOrModifyObj(
		expr: MemberExpr,
		value?: RuntimeValue,
		property?: Identifier
	): RuntimeValue {
		if (expr.object.kind === 'MemberExpr')
			return this.lookupOrModifyObj(
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

		// if a value is provided, the object is most likely being modified by adding a new property
		if (value) oldVal.properties.set(prop, value);

		// if currProp is not undefined, then it exists and its value should be returned
		if (currProp) oldVal = oldVal.properties.get(currProp) as ObjectValue;

		return oldVal;
	}

	public lookupVar(varName: string): RuntimeValue {
		const env = this.resolve(varName);
		return env.variables.get(varName) as RuntimeValue;
	}

	public resolve(varName: string): Environment {
		if (this.variables.has(varName)) return this;
		if (this.parent == undefined)
			throw `Unable to resolve variable "${varName}" as it does not exist.`;

		return this.parent.resolve(varName);
	}
}
