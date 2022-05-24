import { SlashCommandBuilder } from '@discordjs/builders';
import { AkenoClient } from '../client';
import AkenoEmbed from '../embeds/embeds';
import SlashCommand from '../slashCommand';
import SlashContext from '../slashContext';

export default class Ping extends SlashCommand {
    constructor(client: AkenoClient) {
        super({
            client,
            slashData: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Pong!')
                .toJSON(),
        });
    }

    async execute(ctx: SlashContext): Promise<boolean> {
        await ctx.reply({
            embeds: [
                new AkenoEmbed().setDescription(
                    `Pong! Client latency is **${ctx.client.ws.ping}ms**`
                ),
            ],
        });

        return true;
    }
}
