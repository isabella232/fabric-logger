import { debug as createDebug } from 'debug';
import { readFile, writeFile } from 'fs-extra';

const debug = createDebug('updatek8s');
debug.enabled = true;

async function replaceLineInFile(fileName: string, lineStartsWith: string, replacement: string) {
    const fileContents = await readFile(fileName, { encoding: 'utf-8' });

    const toWrite = new Array<String>();
    for (const line of fileContents.split('\n')) {
        if (line.startsWith(lineStartsWith)) {
            toWrite.push(replacement);
        } else {
            toWrite.push(line);
        }
    }
    await writeFile(fileName, toWrite.join('\n'));
}

async function main() {
    const newVersion = process.argv[process.argv.length - 1];

    debug(`Updating version of chart to ${newVersion}`);
    await replaceLineInFile('helm-chart/fabric-logger/Chart.yaml', 'version: ', 'version: ' + newVersion);
    await replaceLineInFile('helm-chart/fabric-logger/Chart.yaml', 'appVersion: ', 'appVersion: ' + newVersion);
    await replaceLineInFile('helm-chart/fabric-logger/values.yaml', '  version: ', '  version: ' + newVersion);
}

main().catch((e) => {
    debug('FATAL', e);
    process.exit(1);
});
