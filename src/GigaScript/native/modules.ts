import { Program } from '../ast/ast';
import Parser from '../parser/parser';
import { createGlobalScope } from '../runtime/env';
import { evaluate } from '../runtime/interpreter/interpreter';
import { DataConstructors, GSNativeFn, GSString } from '../runtime/types';

export const ModuleNames: string[] = ['gigascript', 'node', 'os', 'path', 'fs'];

// export const Modules = DataConstructors.OBJECT(
// 	new Map().set(
// 		'gigascript',
// 		DataConstructors.OBJECT(
// 			new Map().set(
// 				'eval',
// 				DataConstructors.NATIVEFN((args, scope) => {
// 					const evalSource = (args[0] as GSString).value;
// 					const parser = new Parser();
// 					parser.tokenizeSource(evalSource);
// 					const script: Program = parser.generateAST();
// 					const env = createGlobalScope(scope.cwd);
// 					return evaluate(script, env);
// 				})
// 			)
// 		)
// 	)
// );

export const Modules: Map<string, GSNativeFn> = new Map().set('gigascript', {
	eval: DataConstructors.NATIVEFN((args, scope) => {
		const evalSource = (args[0] as GSString).value;
		const parser = new Parser();
		parser.tokenizeSource(evalSource);
		const script: Program = parser.generateAST();
		const env = createGlobalScope(scope.cwd);
		return evaluate(script, env);
	}),
	parse: DataConstructors.NATIVEFN((args, _scope) => {
		const evalSource = (args[0] as GSString).value;
		const parser = new Parser();
		parser.tokenizeSource(evalSource);
		const script: Program = parser.generateAST();
		return DataConstructors.STRING(JSON.stringify(script));
	}),
});
