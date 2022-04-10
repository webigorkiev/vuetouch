#!/usr/bin/env node

import { exec as execCallback, spawn } from 'child_process';
import util from 'util';
import os from "os";
import margv from "margv";

const cwd = './';
const red = "\x1b[31m";
const green = "\x1b[32m";
const black = "\x1b[0m";
const exec = util.promisify(execCallback);
const platform = os.platform();
const osType = os.type();

let [node, script, commit] = process.argv;
const args = margv();
commit = args.m || commit;

if(!commit) {
    console.log(red, "Commit label not set. Aborting...", black);
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
    stream.on('close', code => {

        if(code !== 0) {

            reject(code);
        } else {

            resolve(code);
        }
    });
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
console.log(green, "4. Процесс успешно завершен", black);
