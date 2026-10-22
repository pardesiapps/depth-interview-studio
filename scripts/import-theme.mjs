import {copyFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const source=process.argv[2];if(!source)throw Error('Provide the source public/ directory: npm run theme:import -- /absolute/path/public');
for(const name of ['style.css','applications.css']){const file=resolve(source,name);if(!(await stat(file)).isFile())throw Error('Missing source '+name);await copyFile(file,'public/'+name)}
const result=spawnSync(process.execPath,['scripts/extract-tokens.mjs'],{stdio:'inherit'});if(result.status)process.exit(result.status);console.log('Imported stylesheets only. Review the diff, docs and version before release.');
