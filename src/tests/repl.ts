// import parser
import repl from 'repl';

const v = 'v1';
const r = repl.start({ prompt: `REPL ${v}\n> `, eval: handle });

function handle() {
    console.log('WIP');
}
