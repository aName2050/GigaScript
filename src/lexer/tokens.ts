import { Token } from '../../typescript/GS.types';
import { Node } from '../parser/nodes';

/**
 * GigaScript tokens
 *
 * @readonly
 */
export namespace TokenID {
	export enum Literal {
		/** Any number between 0 and 9 */
		_Number,
		/** Any combination of characters and numbers */
		_String,

		/** True value */
		_True,
		/** False value */
		_False,

		/** Undefined value */
		_Undefined,

		/** Null value */
		_Null,

		/** User defined symbol */
		_Identifier,
	}

	export enum Keyword {
		/** Mutable variable declaration */
		Var,
		/** Constant variable declaration */
		Const,

		/** Function declaration */
		Function,
		/** Return statement */
		Return,

		/** Class declaration */
		Class,
		/** Class constructor method */
		Constructor,
		/** Private method/property */
		Private,
		/** Public method/property */
		Public,
		/** Static method/property */
		Static,
		/** New class */
		New,
		/** See https://en.wikipedia.org/wiki/This_(computer_programming) */
		_This,

		/** If statement */
		If,
		/** Else statement */
		Else,

		/** While loop statement */
		While,
		/** For loop statement */
		For,
		/** Continue loop statement */
		Continue,
		/** Break loop statement */
		Break,

		/** Import external file statement */
		Import,
		/** Export value statement */
		Export,
		/** From file statement */
		From,
		/** As statement */
		As,

		/** Throw an exception */
		ThrowError,

		/** Try statement */
		Try,
		/** Catch statement */
		Catch,
	}

	export enum Operation {
		/** Binary operation ( + - * / % ) */
		BinOp,

		/** Bitwise Operation ( >> << & | ~ ^ ) */
		BitwiseOp,
	}

	export enum Symbol {
		Semicolon,
		Colon,
		Dot,
		Comma,
	}

	export enum AssignmentOperator {
		Equals,

		PlusEquals,
		MinusEquals,
		AsteriskEquals,
		SlashEquals,
		PercentEquals,

		/** <<= */
		LessThanLessThanEquals,
		/** >>= */
		GreaterThanGreaterThanEquals,
		/** >>>= */
		GreaterThanGreaterThanGreaterThanEquals,
		/** &= */
		AmpersandEquals,
		/** |= */
		BarEquals,
		/** ^= */
		CaretEquals,
	}

	export enum ComparisonOperator {
		GreaterThan,
		LessThan,
		GreaterThanEquals,
		LessThanEquals,
		EqualsEquals,
		ExclamationEquals,
	}

	export enum UnaryOperator {
		/** Increment ( ++ ) */
		PlusPlus,
		/** Decrement ( -- ) */
		MinusMinus,
	}

	export enum LogicalOperator {
		/** && */
		AmpersandAmpersand,
		/** || */
		BarBar,
		/** ! */
		Exclamation,
	}

	export enum BitwiseOperator {
		/** & */
		Ampersand,
		/** | */
		Bar,
		/** ^ */
		Caret,
		/** ~ */
		Tilda,

		/** Bitwise LEFT SHIFT ( << ) */
		LessThanLessThan,
		/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
		GreaterThanGreaterThan,
		/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
		GreaterThanGreaterThanGreaterThan,
	}

	export enum Group {
		/** ( */
		OpenParen,
		/** ) */
		CloseParen,
		/** { */
		OpenBrace,
		/** } */
		CloseBrace,
		/** [ */
		OpenBracket,
		/** ] */
		CloseBracket,
		/** " */
		DoubleQuote,
		/** ' */
		SingleQuote,
	}

	export enum Special {
		/** Type declaration */
		__TYPE,
		/** COmment */
		__COMMENT__,
		/** End Of File */
		__EOF__,
	}
}

let Tokens: Record<string, Token> = {};

function setTokenData(
	id: Token['id'],
	type: Token['type'],
	value: string
): Token {
	const token = {
		id,
		type,
		value,
		__GSC: {
			_POS: {
				start: {
					Line: null,
					Column: null,
				},
				end: {
					Line: null,
					Column: null,
				},
			},
			_LENGTH: null,
		},
	} as Token;

	Tokens[value] = token;

	return token;
}

export function getTokenByValue(value: string): Token | undefined {
	return Tokens[value];
}

setTokenData(TokenID.Literal._True, Node.Literal.IDENTIFIER, 'true');
setTokenData(TokenID.Literal._False, Node.Literal.IDENTIFIER, 'false');

export { Tokens };
