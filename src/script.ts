import fs from "fs";
import repl from "repl";

import Parser from "./GigaScript/parser/parser";
import { evaluate } from "./GigaScript/runtime/interpreter";
import { createGlobalScope } from "./GigaScript/runtime/environment";

const file = process.argv[2];

const REPL = {
	parser: new Parser(),
	env: createGlobalScope(),
};

if (file) {
	// run file
	run(file);
} else {
	// start repl
	const v = "v1";
	console.log(`GigaScript REPL ${v}\n`);

	repl.start({ prompt: "> ", eval: handle });
}

function run(filename: string) {
	const parser = new Parser();
	const env = createGlobalScope();

	let file = fs.readFileSync(filename, "utf-8");

	if (file.endsWith(".g")) {
		// handle standard GigaScript files
		const program = parser.generateAST(file);
		const res = evaluate(program, env);

		return res;
	} else if (file.endsWith(".gsx")) {
		// handle gen-z GigaScript files
		console.log(".gsx files are not yet supported");
		process.exit(1);
	} else {
		throw `File does not end with ".g" or ".gsx". ${
			file.split(".")[1]
		} is not a supported file type.`;
	}
}

function handle(
	uInput: string,
	_context: unknown,
	_filename: unknown,
	callback: any
): void {
	const program = REPL.parser.generateAST(uInput);
	evaluate(program, REPL.env);
	callback();
}