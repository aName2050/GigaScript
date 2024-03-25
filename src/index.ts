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

const fileLocation: string = file ? path.parse(file).dir : '';

const srcFileLocStr: string | undefined = file ? path.resolve(file) : undefined;

export { CLIArgs, srcFileLocStr as sourceFile, useCUDA };

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
	const env = createGlobalScope(fileLocation);

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// Run GigaScript code
		parser.tokenizeSource(file);
		parser.Tokens.forEach(token => {
			console.log(
				`${NodeType[token.type]} "${token.value}" -> ${JSON.stringify(
					token.__GSC._POS
				)}`
			);
			console.log(
				'tokenLength:',
				token.__GSC._POS.end.Column! - token.__GSC._POS.start.Column!
			);
		});
		// const program: Program = parser.generateAST();
		// console.log(program);
		// const res = evaluate(program, env);
		// return res;
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
