import { Program } from '../ast/ast';
import Parser from '../parser/parser';
import { createGlobalScope } from '../runtime/env';
import { evaluate } from '../runtime/interpreter/interpreter';
import {
	DataConstructors,
	GSNativeFn,
	GSObject,
	GSString,
} from '../runtime/types';

import * as OS from 'node:os';

export const ModuleNames: string[] = ['gigascript', 'os', 'path', 'fs'];

export const Modules: Map<string, Map<string, GSNativeFn>> = new Map()
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
	);
