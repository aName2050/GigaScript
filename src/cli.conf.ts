import { ArgumentParser } from 'argparse';
import { version } from '../package.json';
import { CLIArguments } from './types';

const argParser = new ArgumentParser({ description: 'GigaScript Runtime CLI' });

argParser.add_argument('-v', '--v', {
	action: 'version',
	version,
	help: 'GigaScript Runtime version',
});
argParser.add_argument('-f', '--file', {
	metavar: 'FILE',
	type: String,
	help: 'the file to run',
});
// TODO: add other CLI arguments

export const args: CLIArguments = argParser.parse_args();
