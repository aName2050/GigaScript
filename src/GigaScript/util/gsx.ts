import { Program } from '../ast/ast';
import Parser from '../parser/parser';
import { Token } from '../types';

const CHARS: Record<string, string> = {
    // TOKENS
    lit: 'let',
    bro: 'const',

    bruh: 'func',

    sus: 'if',
    imposter: 'else',

    yall: 'for',

    big: '>',
    lil: '<',
    frfr: '==',
    nah: '!=',
    btw: '&&',
    carenot: '||',

    with: '+',
    without: '-',
    by: '*',
    some: '/',
    left: '%',

    be: '=',

    rn: ';',

    // SPECIAL
    nocap: 'true',
    cap: 'false',
    fake: 'null',

    messAround: 'try',
    findOut: 'catch',

    waffle: 'print',
    nerd: 'math',
};

export function parseGSX(source: string): Program {
    const src = source.split('\n'); // handle line by line
    const tokensFound = new Array<Token>();

    // Tokenize code
    while (src.length > 0) {
        // TODO: implement
    }

    // Parse translated code
    const parser = new Parser();
    const program = parser.generateGSXAST(tokensFound);

    return program;
}
