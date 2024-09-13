import { TokenID } from '../src/lexer/tokens';
import { Node } from '../src/parser/nodes';
import { SpecialError } from './Error.types';

export class GSError extends Error {
	constructor(name: SpecialError, message: string, location: string) {
		super(`${message}\n\tat (${location})`);
		this.name = name;
	}
}

export class TSError extends Error {
	constructor(name: SpecialError, message: string) {
		super(`${message}`);
		this.name = name;
	}
}

export class CUDAError extends Error {
	constructor(name: SpecialError, message: string) {
		super(`${message}`);
		this.name = name;
	}
}

/** Represents a single token */
export interface Token {
	/** Token ID */
	id:
		| TokenID.AssignmentOperator
		| TokenID.BitwiseOperator
		| TokenID.ComparisonOperator
		| TokenID.Group
		| TokenID.Keyword
		| TokenID.Literal
		| TokenID.LogicalOperator
		| TokenID.Operation
		| TokenID.Special
		| TokenID.Symbol
		| TokenID.UnaryOperator;
	/** Token structure */
	type:
		| Node.AssignmentOperator
		| Node.BitwiseOperator
		| Node.ComparisonOperator
		| Node.Group
		| Node.Keyword
		| Node.Literal
		| Node.LogicalOperator
		| Node.Operation
		| Node.Special
		| Node.Symbol
		| Node.UnaryOperator;
	/** Raw value as seen in the source file */
	value: string;
	/** GigaScript Token Data */
	__GSC: GSData;
}

interface GSData {
	_POS: TokenPosition;
	_LENGTH: number | null;
	_SRC_FILE?: string;
	_METADATA?: Record<string, any>;
}

interface TokenPosition {
	start: { Line: number | null; Column: number | null };
	end: { Line: number | null; Column: number | null };
}
