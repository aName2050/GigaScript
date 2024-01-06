import repl from 'repl';

import Parser from '../GigaScript/parser/parser';
import { createGlobalScope } from '../GigaScript/runtime/environment';
import { evaluate } from '../GigaScript/runtime/interpreter';

import { MK_NULL, MK_NUMBER, MK_BOOL } from '../GigaScript/runtime/values';

const v = 'v1';
console.log(`REPL ${v}\n`);
const r = repl.start({ prompt: `> `, eval: handle });

const parser = new Parser();
const env = createGlobalScope();

function handle(
    uInput: string,
    context: unknown,
    filename: unknown,
    callback: any
) {
    const program = parser.generateAST(uInput);
    const result = evaluate(program, env);
    callback(null, result);
}

export default r;
