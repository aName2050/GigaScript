import { SOURCE_FILE } from '../../..';
import { SpecialError } from '../../../../typescript/Error.types';
import { GSError } from '../../../../typescript/GS.types';
import { AssignmentExpression } from '../../../ast/expressions/assignemts.ast';
import { BinaryExpr } from '../../../ast/expressions/binop.ast';
import { CallExpr } from '../../../ast/expressions/expressions.ast';
import { Identifier } from '../../../ast/literals/literals.ast';
import { Node } from '../../../parser/nodes';
import Environment from '../../env';
import {
	DataConstructors,
	FunctionValue,
	GSAny,
	GSBoolean,
	GSNil,
	GSNumber,
	GSString,
	GSUndefined,
	NativeFunctionValue,
} from '../../types';
import { evaluate } from '../interpreter';

export function evalIdentifier(
	identifier: Identifier,
	env: Environment
): GSAny {
	const val = env.lookupVar(identifier);
	return val;
}

export function evalBinaryExpr(binop: BinaryExpr, env: Environment): GSAny {
	const lhs = evaluate(binop.lhs, env);
	const rhs = evaluate(binop.rhs, env);

	return evalNumericBinaryExpr(lhs, rhs, binop.op);
}

export function evalNumericBinaryExpr(
	lhs: GSAny,
	rhs: GSAny,
	op: BinaryExpr['op']
): GSAny {
	switch (op) {
		case Node.ComparisonOperator.NotEqual:
			return equals(lhs, rhs, false);
		case Node.ComparisonOperator.IsEqual:
			return equals(lhs, rhs, true);
		case Node.LogicalOperator.LogicalAND: {
			const blhs = lhs as GSBoolean;
			const brhs = rhs as GSBoolean;

			return DataConstructors.BOOLEAN(blhs.value && brhs.value);
		}
		case Node.LogicalOperator.LogicalOR: {
			const blhs = lhs as GSBoolean;
			const brhs = rhs as GSBoolean;

			return DataConstructors.BOOLEAN(blhs.value || brhs.value);
		}
		default:
			if (lhs.type === 'number' && rhs.type === 'number') {
				const nlhs = lhs as GSNumber;
				const nrhs = rhs as GSNumber;

				switch (op) {
					case Node.Symbol.Plus:
						return DataConstructors.NUMBER(nlhs.value + nrhs.value);

					case Node.Symbol.Minus:
						return DataConstructors.NUMBER(nlhs.value - nrhs.value);

					case Node.Symbol.Multiply:
						return DataConstructors.NUMBER(nlhs.value * nrhs.value);

					case Node.Symbol.Divide:
						return DataConstructors.NUMBER(nlhs.value / nrhs.value);

					case Node.Symbol.Modulo:
						return DataConstructors.NUMBER(nlhs.value % nrhs.value);

					case Node.ComparisonOperator.LessThan:
						return DataConstructors.BOOLEAN(
							nlhs.value < nrhs.value
						);

					case Node.ComparisonOperator.GreaterThan:
						return DataConstructors.BOOLEAN(
							nlhs.value > nrhs.value
						);

					case Node.ComparisonOperator.LessThanOrEquals:
						return DataConstructors.BOOLEAN(
							nlhs.value <= nrhs.value
						);

					case Node.ComparisonOperator.GreaterThanOrEquals:
						return DataConstructors.BOOLEAN(
							nlhs.value >= nrhs.value
						);

					default:
						throw new GSError(
							SpecialError.RuntimeError,
							`unknown operator "${op}`,
							`${SOURCE_FILE}`
						);
				}
			} else {
				return DataConstructors.NULL();
			}
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
				compare((lhs as GSUndefined).value, (rhs as GSUndefined).value)
			);

		case 'nil':
			return DataConstructors.BOOLEAN(
				compare((lhs as GSNil).value, (rhs as GSNil).value)
			);

		// TODO: object
		// TODO: array
		// TODO: function
		// TODO: nativefn
		// TODO: class

		default:
			throw new GSError(
				SpecialError.RuntimeError,
				`Unknown type in comparison: LHS: ${lhs}, RHS: ${rhs}`,
				`${SOURCE_FILE}`
			);
	}
}

export function evalCallExpr(expr: CallExpr, env: Environment): GSAny {
	const args = expr.args.map(arg => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == 'nativeFn') {
		const result = (fn as NativeFunctionValue).call(args, env);
		return result;
	}

	if (fn.type == 'Function') {
		const func = fn as FunctionValue;
		const scope = new Environment(env.cwd, func.declarationEnvironment);

		for (let i = 0; i < Object.keys(func.params).length; i++) {
			if (Object.keys(func.params).length != args.length) {
				throw new GSError(
					SpecialError.EvalError,
					`Expected ${
						Object.keys(func.params).length
					} arguments, got ${args.length}`,
					`${SOURCE_FILE}:${expr.start.Line}:${expr.start.Column}`
				);
			}
			if (func.params[`${Object.keys(func.params)[i]}`] != args[i].type) {
				throw new GSError(
					SpecialError.TypeError,
					`Expected ${
						func.params[`${Object.keys(func.params)[i]}`]
					}, instead got ${args[i].type}`,
					`${SOURCE_FILE}:${expr.start.Line}:${expr.start.Column}`
				);
			}

			const varName = Object.keys(func.params)[i];
			scope.declareVariable(
				{ symbol: varName } as Identifier,
				args[i],
				false
			);
		}

		let result: GSAny = DataConstructors.UNDEFINED();

		for (const stmt of func.body.body) {
			if (stmt.kind == 'ReturnStatement') {
				result = evaluate(stmt, scope);
				// TODO: add return type check
				break;
			}

			evaluate(stmt, scope);
		}

		return result;
	}

	throw new GSError(
		SpecialError.EvalError,
		`Cannot call a non-function value: ${JSON.stringify(fn)}`,
		`${SOURCE_FILE}:${expr.start.Line}:${expr.start.Column}`
	);
}

export function evalAssignment(
	node: AssignmentExpression,
	env: Environment
): GSAny {
	// if (node.assigne.kind === 'MemberExpr') return eval member expr TODO:
	if (node.assigne.kind !== 'Identifier') {
		throw new GSError(
			SpecialError.EvalError,
			`Invalid LHS expression: ${JSON.stringify(node.assigne)}`,
			`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
		);
	}

	const op = node.AsgOp;
	if (op == Node.AssignmentOperator.Equals)
		return env.assignVariable(
			node.assigne as Identifier,
			evaluate(node.value, env)
		);

	const value = evaluate(node.value, env);
	let variable = env.lookupVar(node.assigne as Identifier);
	let type: 'number' | 'string' | 'boolean' | 'any';

	// eval type conversions
	if (value.type == 'number') {
		variable = DataConstructors.NUMBER(variable.value);
		type = 'number';
	} else if (value.type == 'string') {
		variable = DataConstructors.STRING(variable.value);
		type = 'string';
	} else if (value.type == 'boolean') {
		variable = DataConstructors.BOOLEAN(variable.value);
		type = 'boolean';
	} else type = 'any';

	if (type == 'number') {
		// TODO: finish
		switch (op) {
			case Node.AssignmentOperator.AsgAdd:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(variable.value + value.value)
				);

			case Node.AssignmentOperator.AsgMin:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(variable.value - value.value)
				);
			case Node.AssignmentOperator.AsgMult:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(
						variable.value * evaluate(node.value, env).value
					)
				);
			case Node.AssignmentOperator.AsgDiv:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(
						variable.value / evaluate(node.value, env).value
					)
				);
			case Node.AssignmentOperator.AsgMod:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(
						variable.value % evaluate(node.value, env).value
					)
				);

			default:
				throw new GSError(
					SpecialError.RuntimeError,
					`Unknown operator "${op}"`,
					`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
				);
		}
	} else if (type == 'string') {
		switch (op) {
			case Node.AssignmentOperator.AsgAdd:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.BOOLEAN(
						variable.value + evaluate(node.value, env).value
					)
				);
			case Node.AssignmentOperator.AsgMin:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgMult:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgDiv:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgMod:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			default:
				throw new GSError(
					SpecialError.RuntimeError,
					`Unknown operator "${op}"`,
					`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
				);
		}
	} else if (type == 'boolean') {
		switch (op) {
			case Node.AssignmentOperator.AsgAdd:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.BOOLEAN(
						variable.value + evaluate(node.value, env).value
					)
				);
			case Node.AssignmentOperator.AsgMin:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgMult:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgDiv:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			case Node.AssignmentOperator.AsgMod:
				return env.assignVariable(
					node.assigne as Identifier,
					DataConstructors.NUMBER(NaN)
				);
			default:
				throw new GSError(
					SpecialError.RuntimeError,
					`Unknown operator "${op}"`,
					`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
				);
		}
	} else {
		throw new GSError(
			SpecialError.RuntimeError,
			`Type ${type} cannot be used with special assignment operators. Only types number, string, and boolean can be used.`,
			`${SOURCE_FILE}:${node.start.Line}:${node.start.Column}`
		);
	}
}
