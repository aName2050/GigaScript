import { SpecialError } from './Error.types';

export class GSError extends Error {
	constructor(name: SpecialError, message: string, location: string) {
		super(`${message}\n\tat (${location})`);
		this.name = name;
	}
}

export class TSError extends Error {
	constructor(name: SpecialError, message: string) {
		super(`${message}`);
		this.name = name;
	}
}

export class CUDAError extends Error {
	constructor(name: SpecialError, message: string) {
		super(`${message}`);
		this.name = name;
	}
}
