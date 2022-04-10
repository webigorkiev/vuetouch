#!/usr/bin/env node

import { exec as execCallback, spawn } from 'child_process';
import util from 'util';
import os from "os";
import margv from "margv";
import fs from "fs-extra";
import prompts from "prompts";
import path from "path";

const cwd = './';
const red = "\x1b[31m";
const green = "\x1b[32m";
const black = "\x1b[0m";
const exec = util.promisify(execCallback);
const platform = os.platform();
const osType = os.type();

const pkg = await fs.readJson(path.resolve("./package.json"));

let [node, script, commit = `v${pkg.version}`] = process.argv;
const args = margv();
commit = args.m || commit;

if(!commit) {
    console.log(red, "Commit label not set. Aborting...", black);
    process.exit(0);
}

const response = await prompts({
    type: 'text',
    name: 'value',
    message: `Создать коммит ${commit}? Y/N`,
    validate: value => value < 18 ? `Y or N` : true
});

if(response.value.toLowerCase() !== 'y') {
    process.exit(0);
}

console.log(platform, osType);

/**
 * C:\Program Files\Git\usr\bin
 *
 * Exec command
 * @param {String} command
 * @param {Array} args
 * @param options
 * @return {Promise<Number>}
 */
const spawnLog = (command, args = [], options = {}) => new Promise((resolve, reject) => {
    options = Object.assign({
        cwd, shell: true,
        stdio: "inherit"
    }, options);
    const stream = spawn(command, args, options);
    stream.on('close', code => resolve(code));
});

// hide loggin --quiet --silent -s
console.log(green, "1. Создание сборки", black);
await spawnLog("yarn build");
console.log(green, "2. Создание коммита " + commit, black);
await spawnLog("git add .", [], {stdio: "ignore"});
await spawnLog(`git commit -m "${commit}"`, [], {stdio: "ignore"});
await spawnLog("git push", [], {stdio: "ignore"});
console.log(green, "3. Создание комита документации", black);
await spawnLog("git --git-dir=docs/.vitepress/dist/.git --work-tree=docs/.vitepress/dist add .", [], {stdio: "ignore"});
await spawnLog(`git --git-dir=docs/.vitepress/dist/.git --work-tree=docs/.vitepress/dist commit -m "${commit}"`, [], {stdio: "ignore"});
await spawnLog("git --git-dir=docs/.vitepress/dist/.git --work-tree=docs/.vitepress/dist push", [], {stdio: "ignore"});
console.log(green, "4. Публикация в npm", black);
await spawnLog("yarn publish ./dist --access=public --new-version=" + pkg.version, [], {stdio: "ignore"});
console.log(green, "5. Процесс успешно завершен", black);
console.log("GitHub", "https://github.com/webigorkiev/vuetouch/");
console.log("GitHub Pages", "https://webigorkiev.github.io/vuetouch-docs/");
console.log("npm", "https://www.npmjs.com/package/@vuemod/vue-touch");
