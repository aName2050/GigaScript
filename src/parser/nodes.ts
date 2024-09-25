/**
 * GigaScript Nodes
 *
 * @readonly
 */
export namespace Node {
	export enum Literal {
		/** Any number between 0 and 9, including decimals */
		NUMBER = 0,
		/** Any combination of characters and numbers */
		STRING = 1,
		/** User defined symbol */
		IDENTIFIER = 2,
	}

	export enum Keyword {
		/** Mutable variable declaration */
		Var = 3,
		/** Constant variable declaration */
		Const = 4,

		/** Function declaration */
		Function = 5,
		/** Return statement */
		Return = 6,

		/** Class declaration */
		Class = 7,
		/** Class constructor */
		Constructor = 8,
		/** Private method/property */
		Private = 9,
		/** Public method/property */
		Public = 10,
		/** Static method/property */
		Static = 11,
		/** New class */
		New = 12,

		/** If statement */
		If = 13,
		/** Else statement */
		Else = 14,

		/** Switch statement */
		Switch = 15,
		/** Case statement */
		Case = 16,
		/** Default statement */
		Default = 17,

		/** For statement */
		For = 18,
		/** While statement */
		While = 19,
		/** Break statement */
		Break = 20,
		/** Continue statement */
		Continue = 21,

		/** Try statement */
		Try = 22,
		/** Catch statement */
		Catch = 23,

		/** Throw statement */
		ThrowError = 24,

		/** Import statement */
		Import = 25,
		/** Export statement */
		Export = 26,
		/** From statement */
		From = 27,
		/** As statement */
		As = 28,
	}

	export enum Operation {
		/** Binary Operation (+ - * / %) */
		BinOp = 29,
		/** Bitwise Operation ( >> << & | ~ ^ ) */
		BitOp = 30,
	}

	export enum Symbol {
		/** Semicolon ( ; ) */
		Semicolon = 31,
		/** Colon ( : ) */
		Colon = 32,
		/** Dot ( . ) */
		Dot = 33,
		/** Comma ( , ) */
		Comma = 34,

		/** Plus ( + ) */
		Plus,
		/** Minus ( - ) */
		Minus,
		/** Multiply ( * ) */
		Multiply,
		/** Divide ( / ) */
		Divide,
		/** Modulo ( % ) */
		Modulo,
	}

	export enum AssignmentOperator {
		/** Equals ( = ) */
		Equals,
		/** Plus Equals ( += ) */
		AsgAdd,
		/** Minus Equals ( -= ) */
		AsgMin,
		/** Multiply Equals ( *= ) */
		AsgMult,
		/** Divide Equals ( /= ) */
		AsgDiv,
		/** Modulo Equals ( %= ) */
		AsgMod,

		/** Bitwise LShift Equals ( <<= ) */
		AsgBitwiseLShift,
		/** Bitwise Signed RShift Equals Equals ( >>= ) */
		AsgBitwiseSRShift,
		/** Bitwise Zero-Fill RShift Equals ( >>>= ) */
		AsgBitwiseZFRShift,
		/** Bitwise AND Equals ( &= ) */
		AsgBitwiseAND,
		/** Bitwise OR Equals ( |= ) */
		AsgBitwiseOR,
		/** Bitwise XOR Equals ( ^= ) */
		AsgBitwiseXOR,
	}

	export enum ComparisonOperator {
		/** Greater Than ( > ) */
		GreaterThan,
		/** Less Than ( < ) */
		LessThan,
		/** Greater Than or Equal to ( >= ) */
		GreaterThanOrEquals,
		/** Less Than or Equal to ( <= ) */
		LessThanOrEquals,
		/** Equal to ( == ) */
		IsEqual,
		/** Not Equal to ( != ) */
		NotEqual,
	}

	export enum UnaryOperator {
		/** Increment ( ++ ) */
		Increment,
		/** Decrement ( -- ) */
		Decrement,

		/** Bitwise NOT ( ~ ) */
		Bitwise_NOT,

		/** Logical NOT ( ! ) */
		LogicalNOT,
	}

	export enum LogicalOperator {
		/** Logical AND ( && ) */
		LogicalAND,
		/** Logical OR ( || ) */
		LogicalOR,
	}

	export enum BitwiseOperator {
		/** Bitwise AND ( & ) */
		Bitwise_AND,
		/** Bitwise OR ( | ) */
		Bitwise_OR,
		/** Bitwise XOR ( ^ ) */
		Bitwise_XOR,
		/** Bitwise LEFT SHIFT ( << ) */
		Bitwise_LShift,
		/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
		Bitwise_SRShift,
		/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
		Bitwise_ZFRShift,
	}

	export enum Group {
		/** Open Parenthesis ( ( )*/
		OpenParen,
		/** Closed Parenthesis ( ) ) */
		CloseParen,
		/** Open Brace ( { ) */
		OpenBrace,
		/** Close Brace ( } ) */
		CloseBrace,
		/** Open Bracket ( [ ) */
		OpenBracket,
		/** CloseBracket ( ] ) */
		CloseBracket,
		/** Double Quote ( " ) */
		DoubleQuote,
		/** Single Quote ( ' ) */
		SingleQuote,
	}

	export enum Special {
		/** Type declaration */
		__TYPE,
		/** Comment */
		__COMMENT__,
		/** End of File */
		__EOF__,
	}
}
