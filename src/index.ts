import fs from 'fs';
import { tokenize } from './GigaScript/lexer/lexer';

const testSource = fs.readFileSync('./src/tests/main.g', { encoding: 'utf-8' });
for (const token of tokenize(testSource)) {
    console.log(token);
}
