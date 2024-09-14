import { readFileSync } from 'fs';
import { GSError, TSError } from '../typescript/GS.types';
import { SpecialError } from '../typescript/Error.types';
import { SOURCE_FILE } from '.';
import { tokenize } from './lexer/tokenizer';

export function run(filename: string, location: string) {
	const parser = undefined; // TODO:
	const env = undefined; // TODO:

	let file = readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// tokenize(file);
		console.log(tokenize(file));
	} else {
		throw new GSError(
			SpecialError.ImportError,
			'Unsupported file type. Make sure you are running a GigaScript source file!',
			`${SOURCE_FILE}`
		);
	}
}
