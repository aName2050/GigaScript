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
		Position: TokenPos;
		Length?: number;
		SourceFile?: string;
		Metadata?: Record<string, any>;
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
	 * Position of last character of the token
	 * within the file
	 */
	End: {
		Line: number;
		Column: number;
	};
}

export class GSError extends Error {
	constructor(name: SpecialError, message: string, location: string) {
		super(`${message}\n    at (${location})`);
		this.name = name;
	}
}

export enum SpecialError {
	ModuleNotFoundError = 'ModuleNotFoundError',
	ParseError = 'ParseError',
	TypeError = 'TypeError',
	SyntaxError = 'SyntaxError',
	NotSupportedError = 'GSE_NotSupported',
	ReferenceError = 'ReferenceError',
	RangeError = 'RangeError',
	RuntimeError = 'RuntimeError',
	ZeroDivisionError = 'ZeroDivisionError',
	FileReadError = 'FileReadError',
	EvalError = 'EvalError',

	InternalError = 'TS_InternalError',
	ImportError = 'TS_ImportError',
	CLIError = 'NODE_CLI',
}

export interface CLIArguments {
	file?: string;
	debug?: boolean;
	ASTOnly?: boolean;
	NoCrashOnError?: boolean;
	SilenceErrors?: boolean;
}
