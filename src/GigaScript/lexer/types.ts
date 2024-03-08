/** Operator Precedence (pretty much order of operations) */
export enum OpPrec {
	/** No operater precedence (1) */
	None,
	/** Assignment operation (2) */
	Assignment,
	/** Conditional expression (3) */
	Conditional,
	/** Logical OR comparison (4) */
	LOGIC_OR,
	/** Logical AND operation (5) */
	LOGIC_AND,
	/** Bitwise OR operation (6) */
	BITWISE_OR,
	/** Bitwise XOR (Exclusive OR) operation (7) */
	BITWISE_XOR,
	/** Bitwise AND operation (8) */
	BITWISE_AND,
	/** Equality expression ( == and != ) (9) */
	Equality,
	/** [BINOP] Additive expression ( + and - ) (9) */
	Additive,
	/** [BINOP] Multiplicative expression ( / and * and % ) (10) */
	Multiplicative,
	/**
	 * Unary expression ( oeprations with only one operand ) (11)
	 *
	 *  1. *=
	 *  2. /=
	 *  3. %=
	 *  4. +=
	 *  5. -=
	 *  6. ++
	 *  7. --
	 * */
	Unary,
}
