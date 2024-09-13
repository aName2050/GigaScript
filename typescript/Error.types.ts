export enum SpecialError {
	// GigaScript Errors
	ModuleNotFoundError = 'ModuleNotFoundError',
	ParseError = 'ParseError',
	TypeError = 'TypeError',
	SyntaxError = 'SyntaxError',
	NotSupportedError = 'NotSupportedError',
	ReferenceError = 'ReferenceError',
	RangeError = 'RangeError',
	RuntimeError = 'RuntimeError',
	ZeroDivisionError = 'ZeroDivisionError',
	FileReadError = 'FileReadError',

	// TypeScript Errors
	ImportError = 'ImportError',
	InternalError = 'InternalError',
	CLIError = 'CLIError',
}
