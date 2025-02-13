import { TokenType } from './lexer/tokens';

/**
 * GigaScript token object
 */
export interface Token {
	/**
	 * The type of token
	 */
	id: TokenType;
	/**
	 * The raw value of the token
	 */
	raw: string;
	/**
	 * Metadata for the token
	 */
	_GSC: {
		/**
		 * Position of the token within the file
		 */
		POS: TokenPos;
	};
}

/**
 * Token position object
 */
export interface TokenPos {
	/**
	 * Position of first character of the token
	 * within the file
	 */
	Start: {
		Line: number;
		Column: number;
	};
	/**
	 * Posiiton of last character of the token
	 * within the file
	 */
	End: {
		Line: number;
		Column: number;
	};
}
