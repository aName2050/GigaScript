import path from 'path';

import { GSError, SpecialError } from './types';

import { args } from './cli.conf';
import { readFileSync } from 'fs';
import Parser from './parser/parser';
import { Program } from './ast/core.ast';

const { file } = args;

function run(filename: string, location: string): void {
	const parser: Parser = new Parser();
	// environment

	let file = readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// const tokens: Token[] = tokenize(file);
		parser.tokenizeSource(file);
		// console.log(parser.Tokens);
		const program: Program = parser.generateAST();
		console.log(program);
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
