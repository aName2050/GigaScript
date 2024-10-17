import { readFileSync } from 'fs';
import { GSError, TSError } from '../typescript/GS.types';
import { SpecialError } from '../typescript/Error.types';
import { SOURCE_FILE } from '.';
import { tokenize } from './lexer/tokenizer';
import Parser from './parser/parser';
import { Node } from './parser/nodes';
import { Program } from './ast/ast';
import { createNewGlobalScope } from './runtime/env';
import { args } from './cli';
import { evaluate } from './runtime/interpreter/interpreter';
import { DataConstructors, GSAny } from './runtime/types';

export function run(filename: string, location: string) {
	const parser = new Parser();
	const env = createNewGlobalScope(location);

	let file = readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		parser.tokenizeSourceFile(file);
		const program: Program = parser.generateAST();

		let res: GSAny = DataConstructors.UNDEFINED();

		if (args.NoCrashOnError) {
			try {
				res = evaluate(program, env);
			} catch (e) {
				console.log(e);
			}
		} else res = evaluate(program, env);

		console.log(res);
		return res;
	} else {
		throw new GSError(
			SpecialError.ImportError,
			'Unsupported file type. Make sure you are running a GigaScript source file!',
			`${SOURCE_FILE}`
		);
	}
}
