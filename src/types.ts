import { TokenType } from './lexer/tokens';

export interface Token {
	ID: TokenType;
	Raw: string;
	_GSC: {
		POS: TokenPos;
	};
}

export interface TokenData {
	ID: TokenType;
	Raw: string;
	Pos: TokenPos;
}

export interface TokenPos {
	Start: {
		Line: number;
		Column: number;
	};
	End: {
		Line: number;
		Column: number;
	};
}
