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

// typescript stuff :(
declare global {
    interface String {
        replaceGSX(target: string, replacement: string): string;
    }
}

// replace gsx from source
String.prototype.replaceGSX = function (
    target: string,
    replacement: string
): string {
    const regex = new RegExp('("[^"]*")|(\b' + target + '\b)', 'g');
    return this.replace(regex, replacement);
};

// TODO: finish implementation

export function readGSX(source: string): string {
    return source
        .replaceGSX('lit', 'let')
        .replaceGSX('bro', 'const')
        .replaceGSX('be', '=')
        .replaceGSX('rn', ';')
        .replaceGSX('sus', 'if')
        .replaceGSX('imposter', 'else')
        .replaceGSX('waffle', 'print')
        .replaceGSX('frfr', '==')
        .replaceGSX('with', '+')
        .replaceGSX('without', '-')
        .replaceGSX('by', '*')
        .replaceGSX('some', '/')
        .replaceGSX('left', '%');
}
