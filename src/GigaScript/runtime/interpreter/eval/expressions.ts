import { sourceFile } from '../../../../index';
import { AssignmentExpr } from '../../../ast/assignments.ast';
import { BinaryExpr } from '../../../ast/binop.ast';
import { BitwiseExpr } from '../../../ast/bitwise.ast';
import { ClassNewInstanceExpr } from '../../../ast/class.ast';
import { CallExpr, MemberExpr } from '../../../ast/expressions.ast';
import {
	Identifier,
	ObjectLiteral,
	StringLiteral,
} from '../../../ast/literals.ast';
import { getValue } from '../../../util/getValue';
import { GSError } from '../../../util/gserror';
import Environment from '../../env';
import {
	DataConstructors,
	FuncVal,
	GSAny,
	GSArray,
	GSBoolean,
	GSNull,
	GSNumber,
	GSObject,
	GSString,
	GSUndefined,
	NativeFnVal,
	ObjectValue,
	Value,
} from '../../types';
import { evaluate } from '../interpreter';
import { evalCodeBlock } from './statements';

export function evalNumericBinaryExpr(
	lhs: GSAny,
	rhs: GSAny,
	op: string
): GSAny {
	if (op === '!=') {
		return equals(lhs, rhs, false);
	} else if (op === '==') {
		return equals(lhs, rhs, true);
	} else if (op === '&&') {
		const blhs = lhs as GSBoolean;
		const brhs = rhs as GSBoolean;

		return DataConstructors.BOOLEAN(blhs.value && brhs.value);
	} else if (op === '||') {
		const blhs = lhs as GSBoolean;
		const brhs = rhs as GSBoolean;

		return DataConstructors.BOOLEAN(blhs.value || brhs.value);
	} else if (lhs.type === 'number' && rhs.type === 'number') {
		const nlhs = lhs as GSNumber;
		const nrhs = rhs as GSNumber;

		switch (op) {
			case '+':
				return DataConstructors.NUMBER(nlhs.value + nrhs.value);

			case '-':
				return DataConstructors.NUMBER(nlhs.value - nrhs.value);

			case '*':
				return DataConstructors.NUMBER(nlhs.value * nrhs.value);

			case '/':
				return DataConstructors.NUMBER(nlhs.value / nrhs.value);

			case '%':
				return DataConstructors.NUMBER(nlhs.value % nrhs.value);

			case '<':
				return DataConstructors.BOOLEAN(nlhs.value < nrhs.value);

			case '>':
				return DataConstructors.BOOLEAN(nlhs.value > nrhs.value);

			default:
				console.log(
					new GSError(
						'RuntimeError',
						`unknown operator "${op}" in operation ${lhs.value} ${op} ${rhs.value}`,
						`${sourceFile}:unknown:unknown`
					)
				);
				process.exit(1);
		}
	} else {
		return DataConstructors.UNDEFINED();
	}
}

export function evalBinaryExpr(binop: BinaryExpr, env: Environment): GSAny {
	const lhs = evaluate(binop.lhs, env);
	const rhs = evaluate(binop.rhs, env);

	return evalNumericBinaryExpr(lhs as GSAny, rhs as GSAny, binop.op);
}

export function evalBitwiseExpr(expr: BitwiseExpr, env: Environment): GSAny {
	const lhs = evaluate(expr.lhs, env);
	const rhs = evaluate(expr.rhs, env);

	if (typeof getValue(lhs) == 'number') {
		const nlhs = lhs as GSNumber;
		const nrhs = rhs as GSNumber;

		switch (expr.op) {
			case '&':
				return DataConstructors.NUMBER(nlhs.value & nrhs.value);
			case '|':
				return DataConstructors.NUMBER(nlhs.value | nrhs.value);
			case '^':
				return DataConstructors.NUMBER(nlhs.value ^ nrhs.value);
			case '<<':
				return DataConstructors.NUMBER(nlhs.value << nrhs.value);
			case '>>':
				return DataConstructors.NUMBER(nlhs.value >> nrhs.value);
			case '>>>':
				return DataConstructors.NUMBER(nlhs.value >>> nrhs.value);

			default:
				console.log(
					new GSError(
						'EvalError',
						`Unknown bitwise operator "${expr.op}"`,
						`${sourceFile}:unknown:unknown`
					)
				);
				process.exit(1);
		}
	} else {
		console.log(
			new GSError(
				'EvalError',
				'Bitwise operations can only be used on numbers',
				`${sourceFile}:unknown:unknown`
			)
		);
		return DataConstructors.UNDEFINED();
	}
}

function equals(lhs: GSAny, rhs: GSAny, strict: boolean): GSAny {
	const compare = strict
		? (a: any, b: any) => a === b
		: (a: any, b: any) => a !== b;

	switch (lhs.type) {
		case 'boolean':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSBoolean).value, (rhs as GSBoolean).value)
			);

		case 'number':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSNumber).value, (rhs as GSNumber).value)
			);

		case 'string':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSString).value, (rhs as GSString).value)
			);

		case 'undefined':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as GSUndefined).value,
					(rhs as Value<'undefined', undefined>).value
				)
			);

		case 'null':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSNull).value, (rhs as GSNull).value)
			);

		case 'object':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as ObjectValue).properties,
					(rhs as ObjectValue).properties
				)
			);

		case 'array':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSArray).value, (rhs as GSArray).value)
			);

		case 'function':
			return DataConstructors.BOOLEAN(
				compare((lhs as FuncVal).body, (rhs as FuncVal).body)
			);

		case 'nativeFn':
			return DataConstructors.BOOLEAN(
				compare((lhs as NativeFnVal).call, (rhs as NativeFnVal).call)
			);

		default:
			console.log(
				new GSError(
					'RuntimeError',
					`Unknown type in comparison: LHS: ${lhs}, RHS: ${rhs}`,
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
	}
}

export function evalIdentifier(
	identifier: Identifier,
	env: Environment
): GSAny {
	const val = env.lookupVar(identifier.symbol);
	return val;
}

export function evalAssignment(node: AssignmentExpr, env: Environment): GSAny {
	if (node.assigne.kind === 'MemberExpr') return evalMemberExpr(env, node);
	if (node.assigne.kind !== 'Identifier') {
		console.log(
			new GSError(
				'EvalError',
				`Invalid LHS expression: ${JSON.stringify(node.assigne)}`,
				`${sourceFile}:unknown:unknown`
			)
		);
		process.exit(1);
	}

	const varName = (node.assigne as Identifier).symbol;

	return env.assignVar(varName, evaluate(node.value, env));
}

export function evalMemberExpr(
	env: Environment,
	node?: AssignmentExpr | null,
	expr?: MemberExpr | null
): GSAny {
	if (expr) {
		const Var = env.lookupObjectValue(expr);

		return Var;
	} else if (node) {
		const Var =
			// env.lookupObjectValue(node.assigne as MemberExpr);
			env.modifyObject(
				node.assigne as MemberExpr,
				evaluate(node.value, env)
			);

		return Var;
	} else {
		console.log(
			new GSError(
				'EvalError',
				'A member expression cannot be evaluated with a member or assignment expression.',
				`${sourceFile}:unknown:unknown`
			)
		);
		process.exit(1);
	}
}

export function evalCallExpr(expr: CallExpr, env: Environment): GSAny {
	const args = expr.args.map(arg => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == 'nativeFn') {
		const result = (fn as NativeFnVal).call(args, env);
		return result;
	}

	if (fn.type == 'function') {
		const func = fn as FuncVal;
		const scope = new Environment(env.cwd, func.decEnv);

		for (let i = 0; i < func.params.length; i++) {
			if (func.params.length != args.length) {
				console.log(
					new GSError(
						'EvalError',
						'Paramters list and arguments list lengths do not match',
						`${sourceFile}:unknown:unknown`
					)
				);
				process.exit(1);
			}

			const varName = func.params[i];
			scope.declareVar(varName, args[i], false);
		}

		let result: GSAny = DataConstructors.UNDEFINED();

		for (const stmt of func.body.body) {
			if (stmt.kind == 'ReturnStatement') {
				result = evaluate(stmt, scope);
				break;
			}

			evaluate(stmt, scope);
		}

		return result;
	}

	console.log(
		new GSError(
			'EvalError',
			`Can not call a value that is not a function: ${JSON.stringify(
				fn
			)}`,
			`${sourceFile}:unknown:unknown`
		)
	);
	process.exit(1);
}

export function evalObjectExpr(obj: ObjectLiteral, env: Environment): GSAny {
	const object = { type: 'object', properties: new Map() } as ObjectValue;

	for (const { key, value } of obj.properties) {
		const val =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, val);
	}

	return object;
}

export function evalNewClassInstanceExpr(
	expr: ClassNewInstanceExpr,
	env: Environment
): GSObject {
	const classObj = env.getClassAsObjectLiteral(expr.name);

	const constructor = classObj.instance.properties.get(
		'constructor'
	) as FuncVal;
	const classEnv = constructor.decEnv;
	const constructorEnv = new Environment(
		classEnv.cwd,
		classEnv as Environment
	);

	const localClassObj = env.getAllClassMethodsAndProperties(
		expr.name
	).instance;

	classEnv.assignVar('this', localClassObj, true);

	// eval constructor statement
	if (expr.args.length != constructor.params.length)
		throw `RuntimeError: constructor expected ${constructor.params.length} arguments, instead got ${expr.args.length}`;

	constructor.params.forEach((param, i) => {
		constructorEnv.declareVar(
			param,
			evaluate(expr.args[i], constructorEnv),
			false
		);
	});

	evalCodeBlock(constructor.body, constructorEnv, false);

	return classObj.instance;
}
