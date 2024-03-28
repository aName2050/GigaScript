import './GigaScript/tokens';

import fs from 'fs';
import repl from 'repl';
import path from 'path';
import { ArgumentParser } from 'argparse';

import { version } from '../package.json';

import Parser from './GigaScript/parser/parser';
import { Program } from './GigaScript/ast/ast';
import { CLIArguments } from './GigaScript/types';
import { createGlobalScope } from './GigaScript/runtime/env';
import { evaluate } from './GigaScript/runtime/interpreter/interpreter';
import { getTokenByTypeEnum } from './GigaScript/tokens';
import { NodeType } from './GigaScript/nodes';
// import interpretor
// import env

const argParser = new ArgumentParser({
	description: 'GigaScript Runtime CLI',
});

argParser.add_argument('-v', '--version', {
	action: 'version',
	version,
	help: 'GigaScript Runtime version',
});
argParser.add_argument('-f', '--file', {
	metavar: 'FILE',
	type: 'string',
	help: 'the file to run',
});
argParser.add_argument('--useCUDA', {
	// action: 'enableCUDA',
	help: 'enable CUDA for tokenization. Requires NVIDIA GPU with CUDA Cores.',
});
argParser.add_argument('--ASTOnly', {
	// action: 'disableEvaluation'
	help: 'disables evaluation and only outputs the AST for debugging purposes.',
});

const CLIArgs: CLIArguments = argParser.parse_args();
const file: string | undefined = CLIArgs.file;
const useCUDA: boolean = CLIArgs.useCUDA || false;
const ASTOnly: boolean = CLIArgs.ASTOnly || false;

const fileLocation: string = file ? path.parse(file).dir : '';

const srcFileLocStr: string | undefined = file ? path.resolve(file) : undefined;

export { CLIArgs, srcFileLocStr as sourceFile, useCUDA };

const REPL = {
	parser: new Parser(),
	env: createGlobalScope(process.cwd()),
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
	const parser = new Parser();
	const env = createGlobalScope(fileLocation);

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// Run GigaScript code
		parser.tokenizeSource(file);
		const program: Program = parser.generateAST();

		if (ASTOnly) return console.log(JSON.stringify(program));

		const res = evaluate(program, env);

		return res;
	} else if (filename.endsWith('.gsx')) {
		// Run GigaScript-X code
		throw 'Not implemented';
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
	REPL.parser.tokenizeSource(uIn);
	const script = REPL.parser.generateAST();

	evaluate(script, REPL.env);

	callback();
}
