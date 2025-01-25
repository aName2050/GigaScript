import { GSError } from './gserror';

export class ParseError extends GSError {
	constructor(message: string, location: string) {
		super('ParseError', message, location);
	}
}
