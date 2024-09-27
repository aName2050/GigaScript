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
		Plus = 35,
		/** Minus ( - ) */
		Minus = 36,
		/** Multiply ( * ) */
		Multiply = 37,
		/** Divide ( / ) */
		Divide = 38,
		/** Modulo ( % ) */
		Modulo = 39,
	}

	export enum AssignmentOperator {
		/** Equals ( = ) */
		Equals = 40,
		/** Plus Equals ( += ) */
		AsgAdd = 41,
		/** Minus Equals ( -= ) */
		AsgMin = 42,
		/** Multiply Equals ( *= ) */
		AsgMult = 43,
		/** Divide Equals ( /= ) */
		AsgDiv = 44,
		/** Modulo Equals ( %= ) */
		AsgMod = 45,

		/** Bitwise LShift Equals ( <<= ) */
		AsgBitwiseLShift = 46,
		/** Bitwise Signed RShift Equals Equals ( >>= ) */
		AsgBitwiseSRShift = 47,
		/** Bitwise Zero-Fill RShift Equals ( >>>= ) */
		AsgBitwiseZFRShift = 48,
		/** Bitwise AND Equals ( &= ) */
		AsgBitwiseAND = 49,
		/** Bitwise OR Equals ( |= ) */
		AsgBitwiseOR = 50,
		/** Bitwise XOR Equals ( ^= ) */
		AsgBitwiseXOR = 51,
	}

	export enum ComparisonOperator {
		/** Greater Than ( > ) */
		GreaterThan = 52,
		/** Less Than ( < ) */
		LessThan = 53,
		/** Greater Than or Equal to ( >= ) */
		GreaterThanOrEquals = 54,
		/** Less Than or Equal to ( <= ) */
		LessThanOrEquals = 55,
		/** Equal to ( == ) */
		IsEqual = 56,
		/** Not Equal to ( != ) */
		NotEqual = 57,
	}

	export enum UnaryOperator {
		/** Increment ( ++ ) */
		Increment = 58,
		/** Decrement ( -- ) */
		Decrement = 59,

		/** Bitwise NOT ( ~ ) */
		Bitwise_NOT = 60,

		/** Logical NOT ( ! ) */
		LogicalNOT = 61,
	}

	export enum LogicalOperator {
		/** Logical AND ( && ) */
		LogicalAND = 62,
		/** Logical OR ( || ) */
		LogicalOR = 63,
	}

	export enum BitwiseOperator {
		/** Bitwise AND ( & ) */
		Bitwise_AND = 64,
		/** Bitwise OR ( | ) */
		Bitwise_OR = 65,
		/** Bitwise XOR ( ^ ) */
		Bitwise_XOR = 66,
		/** Bitwise LEFT SHIFT ( << ) */
		Bitwise_LShift = 67,
		/** Bitwise SIGNED RIGHT SHIFT ( >> ) */
		Bitwise_SRShift = 68,
		/** Bitwise ZERO-FILL RIGHT SHIFT ( >>> ) */
		Bitwise_ZFRShift = 69,
	}

	export enum Group {
		/** Open Parenthesis ( ( )*/
		OpenParen = 70,
		/** Closed Parenthesis ( ) ) */
		CloseParen = 71,
		/** Open Brace ( { ) */
		OpenBrace = 72,
		/** Close Brace ( } ) */
		CloseBrace = 73,
		/** Open Bracket ( [ ) */
		OpenBracket = 74,
		/** CloseBracket ( ] ) */
		CloseBracket = 75,
		/** Double Quote ( " ) */
		DoubleQuote = 76,
		/** Single Quote ( ' ) */
		SingleQuote = 77,
	}

	export enum Special {
		/** Type declaration */
		__TYPE = 78,
		/** Comment */
		__COMMENT__ = 79,
		/** End of File */
		__EOF__ = 80,
	}
}
