/** Operator Precedence (pretty much order of operations) */
export enum OpPrec {
	/** No operater precedence (1) */
	None,
	/** Assignment operation [ = ] (2) */
	Assignment,
	/** Logical OR comparison (3) */
	LOGIC_OR,
	/** Logical AND operation (4) */
	LOGIC_AND,
	/** Bitwise OR operation (5) */
	BITWISE_OR,
	/** Bitwise XOR (Exclusive OR) operation (6) */
	BITWISE_XOR,
	/** Bitwise AND operation (7) */
	BITWISE_AND,
	/** Equality expression ( == and != ) (8) */
	Equality,
	/** Bitwise Shift Operation ( << and >> and >>> ) (9) */
	BITWISE_SHIFT,
	/** [BINOP] Multiplicative expression ( / and * and % ) (10) */
	Multiplicative,
	/** [BINOP] Additive expression ( + and - ) (11) */
	Additive,
	/**
	 * Unary expression ( oeprations with only one operand ) (12)
	 *
	 *  1. ++
	 *  2. --
	 *  3. ~
	 * */
	Unary,
}
