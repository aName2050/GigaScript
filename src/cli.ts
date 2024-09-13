import { ArgumentParser } from 'argparse';
import { version } from '../package.json';
import { CLIArgs } from '../typescript/CLI.types';

const argParser = new ArgumentParser({
	description: 'GigaScript Runtime CLI',
});

argParser.add_argument('-v', '--version', {
	action: 'version',
	version,
	help: 'GigaScript Runtime version',
});
argParser.add_argument('-f', '--file', {
	metavar: 'FILE',
	type: String,
	help: 'the file to run',
});
argParser.add_argument('-d', '--debug', {
	help: 'enables debug mode',
	action: 'store_true',
});
argParser.add_argument('-NCE', '--NoCrashOnGSError', {
	help: 'disables crash on GigaScript error',
	action: 'store_true',
});
argParser.add_argument('-S', '--SilenceErrors', {
	help: 'silences most error messages emitted by the GigaScript parser and interpreter',
	action: 'store_true',
});
argParser.add_argument('--ASTOnly', {
	help: 'disables evaluation and only outputs the AST for debugging purposes.',
	action: 'store_true',
});

export const args: CLIArgs = argParser.parse_args();
