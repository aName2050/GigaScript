import Parser from '../GigaScript/parser/parser';
import { evaluate } from '../GigaScript/runtime/interpreter';

import repl from 'repl';

const v = 'v1';
console.log(`REPL ${v}\n`);
const r = repl.start({ prompt: `> `, eval: handle });

function handle(
    uInput: string,
    context: unknown,
    filename: unknown,
    callback: any
) {
    const parser = new Parser();

    // Produce AST
    const program = parser.generateAST(uInput);
    const result = evaluate(program);
    callback(null, result);
}
