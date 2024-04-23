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

import { readExternalGSModules } from './GigaScript/externalModules/read';

import { Modules, ModuleNames } from './GigaScript/native/modules';
import { DataConstructors, GSAny } from './GigaScript/runtime/types';
import { GSModule } from './GigaScript/externalModules/types';
import { GSError } from './GigaScript/util/gserror';

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
	type: String,
	help: 'the file to run',
});
argParser.add_argument('--useCUDA', {
	help: 'enable CUDA(R) for tokenization. Requires NVIDIA(R) GPU with CUDA(R) Cores.',
	action: 'store_true',
});
argParser.add_argument('--ASTOnly', {
	help: 'disables evaluation and only outputs the AST for debugging purposes.',
	action: 'store_true',
});
argParser.add_argument('-d', '--debug', {
	help: 'enables debug mode',
	action: 'store_true',
});
argParser.add_argument('-NCE', '--NoCrashOnError', {
	help: 'disables crash on error',
	action: 'store_true',
});
argParser.add_argument('-S', '--SilenceErrors', {
	help: 'silences most error messages emitted by the GigaScript parser and interpreter',
	action: 'store_true',
});

const CLIArgs: CLIArguments = argParser.parse_args();
const file: string | undefined = CLIArgs.file;
const useCUDA: boolean = CLIArgs.useCUDA || false;
const ASTOnly: boolean = CLIArgs.ASTOnly || false;
const debug: boolean = CLIArgs.debug || false;
const noCrash: boolean = CLIArgs.NoCrashOnError || false;
const silence: boolean = CLIArgs.SilenceErrors || false;

if (silence && !noCrash) {
	throw new GSError(
		'CommandLineError',
		'You can only silence error messages when the "NoCrashOnError" argument is set.',
		'0:0'
	);
}

export const GSConfig = {
	file,
	useCUDA,
	ASTOnly,
	debug,
	noCrash,
};

let installedModules: Array<GSModule> = [];
console.log(noCrash);
if (noCrash) {
	try {
		installedModules = readExternalGSModules();
	} catch (e) {
		console.log(e);
	}
} else {
	installedModules = readExternalGSModules();
}

if (noCrash) {
	try {
		for (const module of installedModules) {
			Modules.set(module.name, module.exports);
			ModuleNames.push(module.name);
		}
	} catch (e) {
		console.log(e);
	}
} else {
	for (const module of installedModules) {
		Modules.set(module.name, module.exports);
		ModuleNames.push(module.name);
	}
}

if (debug) {
	console.log('GS.DEBUGGER: GigaScript Debugger v1');
}

if (useCUDA) {
	throw 'Tokenization using NVIDIA(R) CUDA(R) Cores';
}

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
	const env = createGlobalScope(location);

	let file = fs.readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		// Run GigaScript code
		const runtimeStart = Date.now();
		const tokenizeStart = Date.now();

		parser.tokenizeSource(file);

		if (debug)
			console.log(
				`GS.DEBUGGER: source tokenized in ${
					Date.now() - tokenizeStart
				}ms`
			);

		const parseStart = Date.now();

		const program: Program = parser.generateAST();

		if (debug)
			console.log(
				`GS.DEBUGGER: tokens parsed in ${Date.now() - parseStart}ms`
			);

		if (ASTOnly) {
			if (debug)
				console.log(
					`GS.DEBUGGER: GigaScript ran in ${
						Date.now() - runtimeStart
					}ms`
				);
			return console.log(JSON.stringify(program));
		}

		const evalStart = Date.now();

		let res: GSAny = DataConstructors.UNDEFINED();

		if (noCrash) {
			try {
				res = evaluate(program, env);
			} catch (e) {
				console.log(e);
			}
		} else res = evaluate(program, env);

		if (debug)
			console.log(
				`GS.DEBUGGER: AST evaluated in ${Date.now() - evalStart}ms`
			);
		if (debug)
			console.log(
				`GS.DEBUGGER: GigaScript ran in ${Date.now() - runtimeStart}ms`
			);

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

	if (noCrash) {
		try {
			evaluate(script, REPL.env);
		} catch (e) {
			console.log(e);
		}
	} else evaluate(script, REPL.env);

	callback();
}
