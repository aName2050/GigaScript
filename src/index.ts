import fs from 'fs';
import repl from 'repl';
import path from 'path';

import { version } from '../package.json';
import Config from '../.config/gs.json';

import { CUDAError, GSError, TSError } from '../typescript/GS.types';
import { SpecialError } from '../typescript/Error.types';

import { args } from './cli';

// runtime
const { file, useCUDA, debug, ASTOnly, NoCrashOnError, SilenceErrors } = args;

if (SilenceErrors && !NoCrashOnError) {
	throw new TSError(
		SpecialError.CLIError,
		'Cannot silence errors while NoCrashOnError is set to false'
	);
}

// GigaScript

// TODO: modules

if (debug) console.log('GS.DEBUGGER: GigaScript Debugger v2');
if (useCUDA)
	throw new CUDAError(
		SpecialError.NotSupportedError,
		'Tokenization using NVIDIA(R) CUDA(R) Cores is currently not available'
	);

const fileLocation: string = file ? path.parse(file).dir : '';
const srcFileLoc: string = file ? path.resolve(file) : 'GSREPL';
export {
	args as CLI_ARGS,
	srcFileLoc as SOURCE_FILE,
	useCUDA as USE_CUDA_TOKENIZATION,
};

// TODO: REPL
