export function parseArgumentsIntoOptions(rawArgs: any): {
    skipPrompts: boolean;
    git: boolean;
    template: string;
    runInstall: boolean;
};
export function promptForMissingOptions(options: any): Promise<any>;
export function cli(args: any): Promise<void>;
