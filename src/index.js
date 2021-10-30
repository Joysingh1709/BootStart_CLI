import chalk from 'chalk';
import figlet from 'figlet';

console.clear();

export async function drawBs() {
    console.log(
        chalk.yellow(
            figlet.textSync('BootStart', { horizontalLayout: 'full' })
        )
    );
}