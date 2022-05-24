import Checks from '../checks';
import { AkenoClient } from '../client';
import { Command } from '../command';
import { CommandContext } from '../context';
import AkenoEmbed from '../embeds/embeds';

export default class Eval extends Command {
    constructor(client: AkenoClient) {
        super({
            client,
            name: 'eval',
            description: 'Evaluates JS code.',
            checks: [Checks.Owner],
        });
    }

    async execute(ctx: CommandContext, args: string[]): Promise<boolean> {
        let code = args.join(' ');

        code = code.replace(/\`/g, '');

        await ctx.message.reply(code);

        try {
            let result = eval(code);

            if (typeof result !== 'string') {
                result = JSON.stringify(result);
            }

            await ctx.message.reply({
                embeds: [
                    new AkenoEmbed().setDescription(
                        `\`\`\`js\n${result}\n\`\`\``
                    ),
                ],
            });
        } catch (e) {
            if (!(e instanceof Error)) {
                return true;
            }

            await ctx.channel.send({
                embeds: [new AkenoEmbed().error(e)],
            });
        }

        return true;
    }
}
