import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

export async function bootstart(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    // const currentFileUrl = import.meta.url;
    // console.log("currentFileUrl : ",path.resolve(path.resolve(__dirname), '../templates', options.template.toLowerCase()));
    // const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../templates', options.template.toLowerCase());

    const templateDir = path.resolve(path.resolve(__dirname), '../templates', options.template.toLowerCase());

    options.templateDirectory = templateDir;

    try {
        await access(templateDir.toString(), fs.constants.R_OK);
    } catch (err) {
        // console.log(err);
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Setting up project files...',
            task: () => copyTemplateFiles(options),
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
            enabled: () => options.git,
        },
        {
            title: 'Installing dependencies...',
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                }),
            skip: () =>
                !options.runInstall
                    ? 'Pass --install to automatically install dependencies'
                    : undefined,
        },
    ]);

    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('Project Created Successfully..!'));
    return true;
}