const CHARS: Record<string, string> = {
	// TOKENS
	lit: 'let',
	bro: 'const',

	bruh: 'func',

	sus: 'if',
	impostor: 'else',

	yall: 'for',

	yoink: 'import',

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
	is: ':',

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
		replaceGSX(target: string): string;
	}
}

// test: ("(.*?)")
// replace gsx from source
String.prototype.replaceGSX = function (target: string): string {
	const regex = new RegExp('(?<!["s])\\b' + target + '\\b(?!["])', 'g');
	return this.replace(regex, CHARS[target]);
};

// TODO: finish implementation

export function readGSX(source: string): string {
	return (
		source
			// Declarations
			.replaceGSX('lit') // let
			.replaceGSX('bro') // const
			.replaceGSX('bruh') // func

			// Conditional statements
			.replaceGSX('sus') // if
			.replaceGSX('impostor') // else

			// Loops
			.replaceGSX('yall') // for

			// Special Statements
			.replaceGSX('yoink') // import

			// Comparisons
			.replaceGSX('frfr') // ==
			.replaceGSX('big') // >
			.replaceGSX('lil') // <
			.replaceGSX('nah') // !=
			.replaceGSX('btw') // &&
			.replaceGSX('carenot') // ||

			// Assignments
			.replaceGSX('be') // =

			// Special symbols
			.replaceGSX('rn') // ;
			.replaceGSX('is') // :

			// Bin Op
			.replaceGSX('with') // +
			.replaceGSX('without') // -
			.replaceGSX('by') // *
			.replaceGSX('some') // /
			.replaceGSX('left') // %

			// Native Functions/Native Variables
			.replaceGSX('waffle') // print
			.replaceGSX('nerd') // math

			.replaceGSX('nocap') // true
			.replaceGSX('cap') // false
			.replaceGSX('fake') // null

			// Native Statements
			.replaceGSX('messAround') // try
			.replaceGSX('findOut') // catch
	);
}
