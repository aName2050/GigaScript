export class GSError extends Error {
	constructor(name: string, message: string, location: string) {
		super(`${message}\n    at (${location})`);
		this.name = name;
	}
}
