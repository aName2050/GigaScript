import fs from 'fs';

import Parser from './GigaScript/parser/parser';
import { evaluate } from './GigaScript/runtime/interpreter';

const g = fs.readFileSync('./src/tests/main.g', { encoding: 'utf-8' }); // standard GigaScript file
const gsx = fs.readFileSync('./src/tests/main.gsx', { encoding: 'utf-8' }); // gen-z slang version of GigaScript
// coming soon!
// const gsc = fs.readFileSync('./src/tests/main.gsc', {encoding: 'utf-8'}); // compiled version of .g file

const parser = new Parser();
const program = parser.generateAST(g);
const result = evaluate(program);
console.log(result);
