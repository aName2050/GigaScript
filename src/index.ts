import fs from 'node:fs';
import path from 'node:path';

export function readFile(filePath: string): string {
	const absolutePath = path.resolve(filePath);
	if (!fs.existsSync(absolutePath)) {
		throw new Error(`File not found: ${absolutePath}`);
	}
	return fs.readFileSync(absolutePath, 'utf8');
}

import { tokenize } from './GigaScript/lexer/tokenizer';
import Parser from './GigaScript/parser/parser';

const filePath = process.argv[2];
if (!filePath) {
	console.error('Please provide a file path as an argument.');
	process.exit(1);
}

const file = path.resolve(filePath);
export { file as SOURCE_FILE };

const fileContent = readFile(filePath);
const parser = new Parser();
parser.tokenizeSource(fileContent);
console.log(parser.Tokens);
parser.generateAbstractSyntaxTree();
