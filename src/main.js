"use-strict";
import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { frameworkChoices } from './cli';

/**
 * access
 * @internal
 */
export const access = promisify(fs.access);

/**
 * copy
 * @internal
 */
export const copy = promisify(ncp);

export async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

export async function initGit(options) {
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

    let tasks = [];

    switch (options.framework) {
        case frameworkChoices[0]:

            options.templateDirectory = await resolveTargetPath(options, options.framework);

            tasks = await createTask([
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

            await projectCreated();
            return true;

            break;

        case options.framework === frameworkChoices[1]:

            break;

        case options.framework === frameworkChoices[2]:

            break;

        case options.framework === frameworkChoices[3]:

            break;

        case options.framework === frameworkChoices[4]:

            break;

        default:

            break;
    }

    //     await tasks.run();
    // 
    //     console.log('%s Project ready', chalk.green.bold('Project Created Successfully..!'));
    //     return true;
}

export async function createTask(task) {
    const tasks = await new Listr(task);
    return tasks;
}

export async function resolveTargetPath(options, framework, template = null) {

    if (framework && template !== null) {
        const templateDir = path.resolve(path.resolve(__dirname), '../templates', options.framework.toLowerCase().replace(/ /g, ""), options.template.toLowerCase().replace(/ /g, ""));
        console.log(templateDir);

        try {
            await access(templateDir.toString(), fs.constants.R_OK);
            return templateDir;
        } catch (err) {
            console.error('%s Invalid template name', chalk.red.bold('ERROR'));
            process.exit(1);
        }
    } else {
        const templateDir = path.resolve(path.resolve(__dirname), '../templates', options.framework.toLowerCase().replace(/ /g, ""));
        console.log(templateDir);

        try {
            await access(templateDir.toString(), fs.constants.R_OK);
            return templateDir;
        } catch (err) {
            console.error('%s Invalid template name', chalk.red.bold('ERROR'));
            process.exit(1);
        }
    }
}

export async function projectCreated() {
    console.log('%s Project ready', chalk.green.bold('Project Created Successfully..!'));
}