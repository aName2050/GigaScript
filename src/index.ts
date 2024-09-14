import path from 'path';

import Config from '../.config/gs.json';

import { GSError, TSError } from '../typescript/GS.types';
import { SpecialError } from '../typescript/Error.types';

import { args } from './cli';
import { run } from './run';

// runtime
const { file, debug, ASTOnly, NoCrashOnError, SilenceErrors } = args;

if (SilenceErrors && !NoCrashOnError) {
	throw new TSError(
		SpecialError.CLIError,
		'Cannot silence errors while NoCrashOnError is set to false'
	);
}

// GigaScript

// TODO: modules

if (debug) console.log('GS.DEBUGGER: GigaScript Debugger v2');

const fileLocation: string = file ? path.parse(file).dir : '';
const srcFileLoc: string = file ? path.resolve(file) : 'GSREPL';
export { args as CLI_ARGS, srcFileLoc as SOURCE_FILE };

if (file && fileLocation) {
	run(file, fileLocation);
} else {
	throw new TSError(
		SpecialError.InternalError,
		'REPL is currently not supported, please use a GigaScript source file.'
	);
}
