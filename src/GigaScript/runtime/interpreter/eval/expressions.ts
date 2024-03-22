import { sourceFile } from '../../../../index';
import { AssignmentExpr, UnaryExpr } from '../../../ast/assignments.ast';
import { BinaryExpr } from '../../../ast/binop.ast';
import { BitwiseExpr } from '../../../ast/bitwise.ast';
import { CallExpr, MemberExpr } from '../../../ast/expressions.ast';
import {
	Identifier,
	NumberLiteral,
	ObjectLiteral,
} from '../../../ast/literals.ast';
import { getValue } from '../../../util/getValue';
import { GSError } from '../../../util/gserror';
import Environment from '../../env';
import {
	DataConstructors,
	DataType,
	FuncVal,
	NativeFnVal,
	ObjectValue,
	Value,
} from '../../types';
import { evaluate } from '../interpreter';

export function evalNumericBinaryExpr(
	lhs: Value<DataType, any>,
	rhs: Value<DataType, any>,
	op: string
): Value<DataType, any> {
	if (op === '!=') {
		return equals(lhs, rhs, false);
	} else if (op === '==') {
		return equals(lhs, rhs, true);
	} else if (op === '&&') {
		const blhs = lhs as Value<'boolean', boolean>;
		const brhs = rhs as Value<'boolean', boolean>;

		return DataConstructors.BOOLEAN(blhs.value && brhs.value);
	} else if (op === '||') {
		const blhs = lhs as Value<'boolean', boolean>;
		const brhs = rhs as Value<'boolean', boolean>;

		return DataConstructors.BOOLEAN(blhs.value || brhs.value);
	} else if (lhs.type === 'number' && rhs.type === 'number') {
		const nlhs = lhs as Value<'number', number>;
		const nrhs = rhs as Value<'number', number>;

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

export function evalBinaryExpr(
	binop: BinaryExpr,
	env: Environment
): Value<DataType, any> {
	const lhs = evaluate(binop.lhs, env);
	const rhs = evaluate(binop.rhs, env);

	return evalNumericBinaryExpr(
		lhs as Value<DataType, any>,
		rhs as Value<DataType, any>,
		binop.op
	);
}

export function evalBitwiseExpr(
	expr: BitwiseExpr,
	env: Environment
): Value<DataType, any> {
	const lhs = evaluate(expr.lhs, env);
	const rhs = evaluate(expr.rhs, env);

	if (typeof getValue(lhs) == 'number') {
		const nlhs = lhs as Value<'number', number>;
		const nrhs = rhs as Value<'number', number>;

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

function equals(
	lhs: Value<DataType, any>,
	rhs: Value<DataType, any>,
	strict: boolean
): Value<DataType, any> {
	const compare = strict
		? (a: any, b: any) => a === b
		: (a: any, b: any) => a !== b;

	switch (lhs.type) {
		case 'boolean':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'boolean', boolean>).value,
					(rhs as Value<'boolean', boolean>).value
				)
			);

		case 'number':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'number', number>).value,
					(rhs as Value<'number', number>).value
				)
			);

		case 'string':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'string', string>).value,
					(rhs as Value<'string', string>).value
				)
			);

		case 'undefined':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'undefined', undefined>).value,
					(rhs as Value<'undefined', undefined>).value
				)
			);

		case 'null':
			return DataConstructors.BOOLEAN(
				compare(
					(lhs as Value<'null', null>).value,
					(rhs as Value<'null', null>).value
				)
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
				compare(
					(lhs as Value<'array', Array<any>>).value,
					(rhs as Value<'array', Array<any>>).value
				)
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
): Value<DataType, any> {
	const val = env.lookupVar(identifier.symbol);
	return val;
}

export function evalAssignment(
	node: AssignmentExpr,
	env: Environment
): Value<DataType, any> {
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
): Value<DataType, any> {
	if (expr) {
		const Var = env.lookupOrModifyObject(expr);

		return Var;
	} else if (node) {
		const Var = env.lookupOrModifyObject(
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

export function evalCallExpr(
	expr: CallExpr,
	env: Environment
): Value<DataType, any> {
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
			scope.delcareVar(varName, args[i], false);
		}

		let result: Value<DataType, any> = DataConstructors.UNDEFINED();

		for (const stmt of func.body) {
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

export function evalObjectExpr(
	obj: ObjectLiteral,
	env: Environment
): Value<DataType, any> {
	const object = { type: 'object', properties: new Map() } as ObjectValue;

	for (const { key, value } of obj.properties) {
		const val =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, val);
	}

	return object;
}

export function evalUnaryExpr(
	expr: UnaryExpr,
	env: Environment
): Value<DataType, any> {
	if (expr.AsgOp == '++') {
		const oldValue = getValue(env.lookupVar(expr.assigne.symbol));
		if (typeof oldValue != 'number') {
			console.log(
				new GSError(
					'EvalError',
					'Can not use unary operator "++" on non-number value',
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
		}

		const newValue = oldValue + 1;
		env.assignVar(expr.assigne.symbol, DataConstructors.NUMBER(newValue));

		return DataConstructors.NUMBER(newValue);
	} else if (expr.AsgOp == '--') {
		const oldValue = getValue(env.lookupVar(expr.assigne.symbol));
		if (typeof oldValue != 'number') {
			console.log(
				new GSError(
					'EvalError',
					'Can not use unary operator "--" on non-number value',
					`${sourceFile}:unknown:unknown`
				)
			);
			process.exit(1);
		}

		const newValue = oldValue - 1;
		env.assignVar(expr.assigne.symbol, DataConstructors.NUMBER(newValue));

		return DataConstructors.NUMBER(newValue);
	} else if (expr.AsgOp == '~') {
		const value = env.lookupVar(expr.assigne.symbol) as Value<
			'number',
			number
		>;
		return DataConstructors.NUMBER(~value);
	} else {
		console.log(
			new GSError(
				'EvalError',
				`Unknown unary operator "${expr.AsgOp}"`,
				`${sourceFile}:unknown:unknown`
			)
		);
		process.exit(1);
	}
}
