import fs from 'fs';

import Parser from './GigaScript/parser/parser';
import { evaluate } from './GigaScript/runtime/interpreter';
import Environment from './GigaScript/runtime/environment';
import { MK_BOOL, MK_NULL } from './GigaScript/runtime/values';

const g = fs.readFileSync('./src/tests/main.g', { encoding: 'utf-8' }); // standard GigaScript file
const gsx = fs.readFileSync('./src/tests/main.gsx', { encoding: 'utf-8' }); // gen-z slang version of GigaScript

/**
 * .g files can be interpreted or compiled
 * .gsx files can only be interpreted
 */

const parser = new Parser();
const env = new Environment();

// GLOBAL VARIABLES
env.delcareVar('true', MK_BOOL(true));
env.delcareVar('false', MK_BOOL(false));
env.delcareVar('null', MK_NULL());

// GIGASCRIPT
const program = parser.generateAST(g);
const result = evaluate(program, env);
console.log(result);
