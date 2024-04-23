import { Program } from '../ast/ast';
import Parser from '../parser/parser';
import Environment, { createGlobalScope } from '../runtime/env';
import { evaluate } from '../runtime/interpreter/interpreter';
import {
	DataConstructors,
	GSAny,
	GSFunction,
	GSNumber,
	GSObject,
	GSString,
} from '../runtime/types';

import * as OS from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import * as nodeHTTP from 'node:http';
import { GSError } from '../util/gserror';
import { sourceFile } from '../..';

export const ModuleNames: string[] = ['gigascript', 'os', 'path', 'fs', 'node'];

export const Modules: Map<string, Map<string, GSAny>> = new Map()
	.set(
		'gigascript',
		new Map()
			.set(
				'eval',
				DataConstructors.NATIVEFN((args, scope) => {
					const evalSource = (args[0] as GSString).value;
					const parser = new Parser();
					parser.tokenizeSource(evalSource);
					const script: Program = parser.generateAST();
					const env = createGlobalScope(scope.cwd);
					return evaluate(script, env);
				})
			)
			.set(
				'parse',
				DataConstructors.NATIVEFN((args, _scope) => {
					const evalSource = (args[0] as GSString).value;
					const parser = new Parser();
					parser.tokenizeSource(evalSource);
					const script: Program = parser.generateAST();
					return DataConstructors.STRING(JSON.stringify(script));
				})
			)
	)
	.set(
		'os',
		new Map()
			.set(
				'arch',
				DataConstructors.NATIVEFN((_args, _scope) => {
					return DataConstructors.STRING(OS.arch());
				})
			)
			.set(
				'cpus',
				DataConstructors.NATIVEFN((_args, _scope) => {
					const processors: Array<GSObject> = new Array<GSObject>();

					OS.cpus().forEach(cpu => {
						processors.push(
							DataConstructors.OBJECT(
								new Map()
									.set(
										'model',
										DataConstructors.STRING(cpu.model)
									)
									.set(
										'speed',
										DataConstructors.NUMBER(cpu.speed)
									)
									.set(
										'times',
										DataConstructors.OBJECT(
											new Map()
												.set(
													'user',
													DataConstructors.NUMBER(
														cpu.times.user
													)
												)
												.set(
													'nice',
													DataConstructors.NUMBER(
														cpu.times.nice
													)
												)
												.set(
													'sys',
													DataConstructors.NUMBER(
														cpu.times.sys
													)
												)
												.set(
													'idle',
													DataConstructors.NUMBER(
														cpu.times.idle
													)
												)
												.set(
													'irq',
													DataConstructors.NUMBER(
														cpu.times.irq
													)
												)
										)
									)
							)
						);
					});

					return DataConstructors.ARRAY(processors);
				})
			)
	)
	.set(
		'fs',
		new Map().set(
			'readFile',
			DataConstructors.NATIVEFN((args, scope) => {
				const file = (args[0] as GSString).value;

				const filePath = path.resolve(`${scope.cwd}/${file}`);
				const out = readFileSync(filePath, { encoding: 'utf-8' });

				return DataConstructors.STRING(out);
			})
		)
	)
	.set(
		'path',
		new Map().set(
			'resolve',
			DataConstructors.NATIVEFN((args, _scope) => {
				let paths: Array<string> = [];
				args.forEach(arg => {
					paths.push((arg as GSString).value);
				});

				return DataConstructors.STRING(path.resolve(...paths));
			})
		)
	)
	.set(
		'node',
		new Map().set(
			'createLocalServer',
			DataConstructors.NATIVEFN((args, scope) => {
				if (args[0].type != 'function')
					throw 'RuntimeError: Expected callback function for "createLocalServer"';

				const callback = args[0] as GSFunction;

				const port = args[1] as GSNumber;

				nodeHTTP
					.createServer((req, res) => {
						const funcScope = new Environment(
							scope.cwd,
							callback.decEnv
						);

						for (const stmt of callback.body.body) {
							evaluate(stmt, funcScope);
						}
					})
					.listen(port.value);

				return DataConstructors.NULL();
			})
		)
	);
