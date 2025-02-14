import path from 'path';

import { GSError, SpecialError, Token } from './types';

import { args } from './cli.conf';
import { readFileSync } from 'fs';
import { tokenize } from './lexer/tokenizer';

const { file } = args;

function run(filename: string, location: string): void {
	// parser
	// environment

	let file = readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		const tokens: Token[] = tokenize(file);
		console.log(tokens);
	}
}

const fileLocation: string = file ? path.parse(file).dir : '';
const srcFileLocation: string = file ? path.resolve(file) : 'GSREPL';
export { args as GS_CLI_ARGS, srcFileLocation as SOURCE_FILE };

if (file && fileLocation) {
	run(file, fileLocation);
} else {
	throw new GSError(
		SpecialError.NotSupportedError,
		'REPL is currently not supported. Use a GigaScript source file (.g).',
		''
	);
}
