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

const filePath = process.argv[2];
if (!filePath) {
	console.error('Please provide a file path as an argument.');
	process.exit(1);
}

const file = path.resolve(filePath);
export { file as SOURCE_FILE };

const fileContent = readFile(filePath);
const tokens = tokenize(fileContent);
console.log(tokens);
