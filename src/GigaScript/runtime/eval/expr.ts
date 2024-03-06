import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	ClassConstructor,
	ClassInit,
	Identifier,
	MemberExpr,
	ObjectLiteral,
} from '../../ast/ast';
import Environment from '../environment';
import { evaluate } from '../interpreter';
import {
	NumberValue,
	RuntimeValue,
	NULL,
	ObjectValue,
	NativeFunctionValue,
	FunctionValue,
	BOOL,
	BooleanValue,
	StringValue,
	UndefinedValue,
	NullValue,
	NUMBER,
	UNDEFINED,
} from '../values';

/**
 * Evaluate numeric operations with binary operators
 */
export function eval_numeric_binary_expr(
	lhs: RuntimeValue,
	rhs: RuntimeValue,
	operator: string
): RuntimeValue {
	const op = operator;

	if (op === '!=') {
		return equals(lhs, rhs, false);
	} else if (op === '==') {
		return equals(lhs, rhs, true);
	} else if (op === '&&') {
		const blhs = lhs as BooleanValue;
		const brhs = rhs as BooleanValue;

		return BOOL(blhs.value && brhs.value);
	} else if (op === '||') {
		const blhs = lhs as BooleanValue;
		const brhs = rhs as BooleanValue;

		return BOOL(blhs.value || brhs.value);
	} else if (lhs.type === 'number' && rhs.type === 'number') {
		const nlhs = lhs as NumberValue;
		const nrhs = rhs as NumberValue;

		switch (op) {
			case '+':
				return NUMBER(nlhs.value + nrhs.value);

			case '-':
				return NUMBER(nlhs.value - nrhs.value);

			case '*':
				return NUMBER(nlhs.value * nrhs.value);

			case '/':
				return NUMBER(nlhs.value / nrhs.value);

			case '%':
				return NUMBER(nlhs.value % nrhs.value);

			case '<':
				return BOOL(nlhs.value < nrhs.value);

			case '>':
				return BOOL(nlhs.value > nrhs.value);

			default:
				throw `RuntimeError: unknown operator "${op}" in operation ${lhs} ${op} ${rhs}`;
		}
	} else {
		return NULL();
	}
}

function equals(
	lhs: RuntimeValue,
	rhs: RuntimeValue,
	strict: boolean
): RuntimeValue {
	const compare = strict
		? (a: any, b: any) => a === b
		: (a: any, b: any) => a !== b;

	switch (lhs.type) {
		case 'boolean':
			return BOOL(
				compare(
					(lhs as BooleanValue).value,
					(rhs as BooleanValue).value
				)
			);

		case 'number':
			return BOOL(
				compare((lhs as NumberValue).value, (rhs as NumberValue).value)
			);

		case 'string':
			return BOOL(
				compare((lhs as StringValue).value, (rhs as StringValue).value)
			);

		case 'undefined':
			return BOOL(
				compare(
					(lhs as UndefinedValue).value,
					(rhs as UndefinedValue).value
				)
			);

		case 'null':
			return BOOL(
				compare((lhs as NullValue).value, (rhs as NullValue).value)
			);

		case 'object':
			return BOOL(
				compare(
					(lhs as ObjectValue).properties,
					(rhs as ObjectValue).properties
				)
			);

		case 'function':
			return BOOL(
				compare(
					(lhs as FunctionValue).body,
					(rhs as FunctionValue).body
				)
			);

		case 'nativeFunction':
			return BOOL(
				compare(
					(lhs as NativeFunctionValue).call,
					(rhs as NativeFunctionValue).call
				)
			);

		// Unknown type catch-all
		default:
			throw `RuntimeError: Unknown type in comparison: ${lhs}, ${rhs}`;
	}
}

/**
 * Evaluates expressions based on the binary operation type
 */
export function eval_binary_expr(
	binop: BinaryExpr,
	env: Environment
): RuntimeValue {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	return eval_numeric_binary_expr(
		lhs as RuntimeValue,
		rhs as RuntimeValue,
		binop.operator
	);
}

export function eval_identifier(
	ident: Identifier,
	env: Environment
): RuntimeValue {
	const val = env.lookupVar(ident.symbol);
	return val;
}

export function eval_assignment(
	node: AssignmentExpr,
	env: Environment
): RuntimeValue {
	if (node.assigne.kind === 'MemberExpr') return eval_member_expr(env, node);
	if (node.assigne.kind !== 'Identifier')
		throw `Invalid LHS expression: ${JSON.stringify(node.assigne)}`;

	const varName = (node.assigne as Identifier).symbol;

	return env.assignVar(varName, evaluate(node.value, env));
}

export function eval_object_expr(
	obj: ObjectLiteral,
	env: Environment
): RuntimeValue {
	const object = { type: 'object', properties: new Map() } as ObjectValue;

	for (const { key, value } of obj.properties) {
		const runtimeVal =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, runtimeVal);
	}

	return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeValue {
	const args = expr.args.map(arg => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == 'nativeFunction') {
		const result = (fn as NativeFunctionValue).call(args, env);
		return result;
	}

	if (fn.type == 'function') {
		const func = fn as FunctionValue;
		const scope = new Environment(env.cwd, func.declarationEnv);

		// Create parameters as variables for new scope
		for (let i = 0; i < func.parameters.length; i++) {
			if (func.parameters.length != args.length)
				throw 'EvalError: Parameters and arguments lengths do not match.';

			const varName = func.parameters[i];
			scope.delcareVar(varName, args[i], false);
		}

		let result: RuntimeValue = UNDEFINED();

		// evaluate the function body line by line
		for (const stmt of func.body) {
			if (stmt.kind == 'ReturnStatement') {
				result = evaluate(stmt, scope);
				break;
			}
			evaluate(stmt, scope);
		}

		return result;
	}

	throw (
		'EvalError: Cannot call a value that is not a function: ' +
		JSON.stringify(fn)
	);
}

export function eval_member_expr(
	env: Environment,
	node?: AssignmentExpr | null,
	expr?: MemberExpr | null
): RuntimeValue {
	if (expr) {
		// find and return value of property accessed through member expression
		const VAR = env.lookupOrModifyObj(expr);
		return VAR;
	} else if (node) {
		// handle assignments into member objects, including adding new properties through -> obj.newProp = newValue
		const VAR = env.lookupOrModifyObj(
			node.assigne as MemberExpr,
			evaluate(node.value, env)
		);

		if (VAR.type == 'object') {
			// TODO: update member eval to allow: obj.complex.x (and longer expressions)
			// return eval_member_expr(env,);
		}

		return VAR;
	} else {
		throw 'EvalError: A member expression cannot be evaluated with a member or assignment expression.';
	}
}

export function eval_class_init_expr(
	node: ClassInit,
	env: Environment
): RuntimeValue {
	env.construct(node.name, node.args);

	// TODO: fix this very broken code
	// I have no idea what I'm doing....

	return UNDEFINED();
}
