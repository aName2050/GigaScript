import * as fs from 'node:fs';
import * as path from 'node:path';
import { GSModule } from './types';
import Parser from '../parser/parser';
import { Program } from '../ast/ast';
import { createGlobalScope } from '../runtime/env';
import { evaluate } from '../runtime/interpreter/interpreter';

export function readExternalGSModules(): Array<GSModule> {
	const moduleDir = path.join(process.cwd(), '.gsmodules');

	// check if the .gsmodules directory exists
	if (!fs.existsSync(moduleDir)) return [];

	const modules = fs.readdirSync(moduleDir);

	let installedModules: Array<GSModule> = [];

	for (const module of modules) {
		const file = fs.readFileSync(path.join(moduleDir, module), {
			encoding: 'utf-8',
		});
		const parser = new Parser();
		parser.tokenizeSource(file);
		const program: Program = parser.generateAST();
		const env = createGlobalScope(moduleDir);
		evaluate(program, env);

		const moduleName = env.exports.get('MODULE_NAME')?.value;
		if (!moduleName)
			throw `ModuleError: Unable to read file "${path.join(
				moduleDir,
				module
			)}". File is missing "MODULE_NAME" export`;

		const exports: GSModule['exports'] = new Map();

		env.exports.forEach((Export, exportName) => {
			if (exportName != 'MODULE_NAME') exports.set(exportName, Export);
		});

		installedModules.push({
			name: moduleName,
			exports,
		} as GSModule);
	}

	return installedModules;
}
