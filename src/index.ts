import './GigaScript/tokens';

import fs from 'fs';
import repl from 'repl';
import path from 'path';
import { ArgumentParser } from 'argparse';

import { version } from '../package.json';

import Parser from './GigaScript/parser/parser';
import { Program } from './GigaScript/ast/ast';
import { CLIArguments } from './GigaScript/types';
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
	// action: 'fileInput',
	help: 'Specify the file you want to run',
});
argParser.add_argument('--useCUDA', {
	// action: 'enableCUDA',
	help: '-useCUDA <true | false>  Enables CUDA for tokenization. Requires NVIDIA GPU with CUDA Cores.',
});

const CLIArgs: CLIArguments = argParser.parse_args();
const file: string | undefined = CLIArgs.file;
const useCUDA: boolean = CLIArgs.useCUDA || false;

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
	const parser = new Parser();
	// create new global scope

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// Run GigaScript code
		const program: Program = parser.generateAST(file);
		console.log(program);
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

	callback();
}
