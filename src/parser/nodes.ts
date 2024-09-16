/**
 * GigaScript Nodes
 *
 * @readonly
 */
export namespace Node {
	export enum Literal {
		/** Any number between 0 and 9, including decimals */
		NUMBER,
		/** Any combination of characters and numbers */
		STRING,
		/** User defined symbol */
		IDENTIFIER,
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
		/** Class constructor */
		Constructor,
		/** Private method/property */
		Private,
		/** Public method/property */
		Public,
		/** Static method/property */
		Static,
		/** New class */
		New,

		/** If statement */
		If,
		/** Else statement */
		Else,

		/** Switch statement */
		Switch,
		/** Case statement */
		Case,
		/** Default statement */
		Default,

		/** For statement */
		For,
		/** While statement */
		While,
		/** Break statement */
		Break,
		/** Continue statement */
		Continue,

		/** Try statement */
		Try,
		/** Catch statement */
		Catch,

		/** Throw statement */
		ThrowError,

		/** Import statement */
		Import,
		/** Export statement */
		Export,
		/** From statement */
		From,
		/** As statement */
		As,
	}

	export enum Operation {
		/** Binary Operation (+ - * / %) */
		BinOp,
		/** Bitwise Operation ( >> << & | ~ ^ ) */
		BitOp,
	}

	export enum Symbol {
		/** Semicolon ( ; ) */
		Semicolon,
		/** Colon ( : ) */
		Colon,
		/** Dot ( . ) */
		Dot,
		/** Comma ( , ) */
		Comma,

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
