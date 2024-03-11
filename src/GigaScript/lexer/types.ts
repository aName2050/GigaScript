/** Operator Precedence (pretty much order of operations) */
export enum OpPrec {
	/** No operater precedence (1) */
	None,
	/** Assignment operation (2) */
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
	/** [BINOP] Additive expression ( + and - ) (10) */
	Additive,
	/** [BINOP] Multiplicative expression ( / and * and % ) (11) */
	Multiplicative,
	/**
	 * Unary expression ( oeprations with only one operand ) (12)
	 *
	 *  1. &=
	 *  2. |=
	 *  3. ^=
	 *  4. ~=
	 *  5. <<=
	 *  6. >>=
	 *  7. >>>=
	 *  8. *=
	 *  9. /=
	 *  10. %=
	 *  11. +=
	 *  12. -=
	 *  13. ++
	 *  14. --
	 * */
	Unary,
}
