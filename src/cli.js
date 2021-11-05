"use-strict";
import arg from 'arg';
import inquirer from 'inquirer';
import { bootstart } from './main';
import { drawBs } from './index';

/**
 * frameworkChoices
 * @internal
 */
export const frameworkChoices = ['Angular', 'React.Js', 'Vue.js', 'Next.js', 'Nest.js', 'Basic Node.js'];

export function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        framework: args._[0],
        template: args._[1],
        runInstall: args['--install'] || false,
    };
}

export async function promptForMissingOptions(options) {
    const defaultTemplate = 'javascript';
    const defaultFramework = 'Basic Node.js';
    if (options.skipPrompts) {
        return {
            ...options,
            framework: options.framework || defaultFramework,
            template: options.template || defaultTemplate,
        };
    }

    const questions = [];

    const frameworkQuestions = [];
    if (!options.framework) {
        frameworkQuestions.push({
            type: 'list',
            name: 'framework',
            message: 'Please choose which project framework to use',
            choices: frameworkChoices,
            default: defaultFramework,
        });
    }
    const frameworkAnswers = await inquirer.prompt(frameworkQuestions);

    const templatekQuestions = [];
    if (!options.template) {
        if (frameworkAnswers.framework !== frameworkChoices[0] && frameworkAnswers.framework !== frameworkChoices[4] && frameworkAnswers.framework !== frameworkChoices[5]) {
            templatekQuestions.push({
                type: 'list',
                name: 'template',
                message: 'Please choose which project template to use',
                choices: ['JavaScript', 'TypeScript'],
                default: defaultTemplate,
            });
        }
    }
    const templateAnswers = await inquirer.prompt(templatekQuestions);

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        });
    }

    if (!options.runInstall) {
        questions.push({
            type: 'confirm',
            name: 'Install dependencies',
            message: 'Install project dependencies?',
            default: false,
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        framework: options.framework || frameworkAnswers.framework,
        template: options.template || templateAnswers.template,
        git: options.git || answers.git,
        runInstall: options.runInstall || answers.runInstall
    };
}

export async function cli(args) {
    await drawBs();
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await bootstart(options);
}