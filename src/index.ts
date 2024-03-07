import fs from 'fs';
import repl from 'repl';
import path from 'path';

import Parser from './GigaScript/parser/parser';
import { evaluate } from './GigaScript/runtime/interpreter';
import { createGlobalScope } from './GigaScript/runtime/environment';

const file = process.argv[2];

let fileLocation: string;

if (file) {
	fileLocation = path.parse(file).dir;
}

const REPL = {
	parser: new Parser(),
	env: createGlobalScope(file),
};

import { tokenizeGSX } from './GigaScript/lexer/gsx';

if (file) {
	// run file
	run(file);
} else {
	// start repl
	const v = 'v1';
	console.log(`GigaScript REPL ${v}\n`);

	repl.start({ prompt: '> ', eval: handle });
}

function run(filename: string) {
	const parser = new Parser();
	const env = createGlobalScope(fileLocation);

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// handle standard GigaScript files
		const program = parser.generateAST(file);
		console.log(program);
		const res = evaluate(program, env);

		return res;
	} else if (filename.endsWith('.gsx')) {
		// handle gen-z GigaScript files
		const translation = tokenizeGSX(file);
		const program = parser.generateGSXAST(translation);

		const res = evaluate(program, env);
		return res;
	} else {
		throw `File does not end with ".g" or ".gsx". ${
			file.split('.')[1]
		} is not a supported file type.`;
	}
}

function handle(
	uInput: string,
	_context: unknown,
	_filename: unknown,
	callback: any
): void {
	const program = REPL.parser.generateAST(uInput);
	evaluate(program, REPL.env);
	callback();
}
