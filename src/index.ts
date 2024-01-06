import fs from 'fs';

import Parser from './GigaScript/parser/parser';
import { evaluate } from './GigaScript/runtime/interpreter';
import { createGlobalScope } from './GigaScript/runtime/environment';

const g = fs.readFileSync('./src/tests/main.g', { encoding: 'utf-8' }); // standard GigaScript file
const gsx = fs.readFileSync('./src/tests/main.gsx', { encoding: 'utf-8' }); // gen-z slang version of GigaScript

/**
 * .g files can be interpreted or compiled
 * .gsx files can only be interpreted
 */

const parser = new Parser();
const env = createGlobalScope();

// GIGASCRIPT INTERPRETER
const program = parser.generateAST(g);
const result = evaluate(program, env);
console.log(result);

// GIGASCRIPT COMPILER
// TODO: make this
