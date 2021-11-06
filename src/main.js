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
 * rmdirSync
 * @internal
 */
export const rmdirSync = promisify(fs.rmdirSync);

/**
 * readDir
 * @internal
 */
export const readDir = promisify(fs.readdir);

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

export async function getFirstDirName(path) {
    const directories = readDir(path);
    return directories;
}

export async function getNewTargetDir(options) {
    const directories = await readDir(options.targetDirectory);
    return options.targetDirectory + '/' + directories[0];
}

export async function finishingTouches(options) {
    const projName = await getFirstDirName(options.targetDirectory);

    const dir = options.targetDirectory + '/' + projName + '/.git';

    const result = rmdirSync(dir, { recursive: true, force: true });

    if (result.failed) {
        return Promise.reject(new Error('Failed to do finishing touches...'));
    }

    return;
}

export async function createTemplateFiles(options, templateUrl) {
    const result = await execa('git', ['clone', templateUrl], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }

    return;
}

export async function initGit(options) {
    const projName = await getFirstDirName(options.targetDirectory);
    const dir = options.targetDirectory + '/' + projName;

    const result = await execa('git', ['init'], {
        cwd: dir,
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

            // options.templateDirectory = await resolveTargetPath(options, options.framework);

            tasks = await createTask(options, "https://github.com/juanmesa2097/angular-boilerplate.git");

            await tasks.run();

            await projectCreated();
            return true;

            break;

        case frameworkChoices[1]:

            // options.templateDirectory = await resolveTargetPath(options, options.framework, options.template);

            tasks = options.template.toLowerCase().replace(/ /g, "") === 'javascript' ?
                await createTask(options, "https://github.com/react-boilerplate/react-boilerplate.git")
                : await createTask(options, "https://github.com/react-boilerplate/react-boilerplate-cra-template.git");

            await tasks.run();

            await projectCreated();
            return true;

            break;

        case frameworkChoices[2]:

            tasks = options.template.toLowerCase().replace(/ /g, "") === 'javascript' ?
                await createTask(options, "https://github.com/davellanedam/vue-skeleton-mvp.git")
                : await createTask(options, "https://github.com/CKGrafico/Frontend-Boilerplates.git");

            tasks = await createTask(options);

            await tasks.run();

            await projectCreated();
            return true;

            break;

        case frameworkChoices[3]:

            tasks = options.template.toLowerCase().replace(/ /g, "") === 'javascript' ?
                await createTask(options, "https://github.com/iaincollins/nextjs-starter.git")
                : await createTask(options, "https://github.com/alepacheco/landing-template.git");

            await tasks.run();

            await projectCreated();
            return true;

            break;

        case frameworkChoices[4]:

            tasks = await createTask(options, "https://github.com/squareboat/nestjs-boilerplate.git");

            await tasks.run();

            await projectCreated();
            return true;

            break;

        default:

            tasks = options.template.toLowerCase().replace(/ /g, "") === 'javascript' ?
                await createTask(options, "https://github.com/sahat/hackathon-starter.git")
                : await createTask(options, "https://github.com/santoshshinde2012/node-boilerplate.git");

            await tasks.run();

            await projectCreated();
            return true;
            break;
    }
}

export async function createTask(options, templateUrl) {
    const tasks = await new Listr([
        {
            title: 'Setting up project files...',
            task: () => createTemplateFiles(options, templateUrl),
        },
        {
            title: 'Setting up important files...',
            task: () => finishingTouches(options),
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
            enabled: () => options.git,
        },
        {
            title: 'Installing dependencies...',
            task: async () =>
                projectInstall({
                    cwd: await getNewTargetDir(options),
                }),
            skip: () =>
                !options.runInstall
                    ? 'Pass --install to automatically install dependencies'
                    : undefined,
        },
    ]);
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