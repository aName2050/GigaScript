import './GigaScript/tokens';

import fs from 'fs';
import repl from 'repl';
import path from 'path';
import { tokenize } from './GigaScript/lexer/tokenizer';

// import parser
// import interpretor
// import env

const file = process.argv[2];

let fileLocation: string | undefined = file ? path.parse(file).dir : undefined;

const REPL = {
	parser: undefined,
	env: undefined,
	v: 'v1',
};

if (file && fileLocation) {
	runFile(file, fileLocation);
} else {
	// start REPL
	console.log(`GigaScript REPL ${REPL.v}\n`);

	repl.start({ prompt: '> ', eval: handle });
}

function runFile(filename: string, location: string) {
	// create new parser instance
	// create new global scope

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// Run GigaScript code
		const tokens = tokenize(file);
		// tokens.forEach(token => {
		// 	console.log(token);
		// });
	} else if (filename.endsWith('.gsx')) {
		// Run GigaScript-X code
	} else {
		throw `${file
			.split('.')
			.pop()} is not a supported file type. ".g" and ".gsx" are the only supported types.`;
	}
}

function handle(
	uIn: string,
	_context: unknown,
	_filename: unknown,
	callback: any
): void {
	// handle REPL

	callback();
}
