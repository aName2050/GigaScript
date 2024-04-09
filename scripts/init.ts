import { exec } from 'node:child_process';
import { promisify } from 'util';

const execSync = promisify(exec);

async function init() {
	// Get absolute path to gigascript
	const REALPATH = await execSync('realpath -s ./.bin');
	// Give executable permission to gigascript
	const CHMOD = await execSync(`chmod +x ${REALPATH.stdout}`);

	console.log(CHMOD.stderr || 'CHMOD completed with no errors');

	const EXPORT_PATH = await execSync(
		`export PATH="${REALPATH.stdout}:$PATH"`
	);

	console.log(EXPORT_PATH.stderr || 'Updated PATH with no errors');

	console.log('Completed GigaScript initialization!');

	console.log('Running "gigascript -v"...');

	const GSV = await execSync('gigascript -v');

	console.log(GSV.stdout);
}
