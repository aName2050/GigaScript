import { readFileSync } from 'fs';
import { GSError, TSError } from '../typescript/GS.types';
import { SpecialError } from '../typescript/Error.types';
import { SOURCE_FILE } from '.';
import { tokenize } from './lexer/tokenizer';
import Parser from './parser/parser';
import { Node } from './parser/nodes';
import { Program } from './ast/ast';
import { createNewGlobalScope } from './runtime/env';

export function run(filename: string, location: string) {
	const parser = new Parser();
	const env = createNewGlobalScope(location);

	let file = readFileSync(filename, { encoding: 'utf-8' });

	if (filename.endsWith('.g')) {
		parser.tokenizeSourceFile(file);
		const program: Program = parser.generateAST();
		// console.log(parser.Tokens);
		console.log(program);
	} else {
		throw new GSError(
			SpecialError.ImportError,
			'Unsupported file type. Make sure you are running a GigaScript source file!',
			`${SOURCE_FILE}`
		);
	}
}
