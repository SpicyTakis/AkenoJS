import { SlashCommandBuilder } from '@discordjs/builders';
import { AkenoClient } from '../models/client';
import AkenoEmbed from '../models/embeds/embeds';
import SlashCommand from '../models/slashCommand';
import SlashContext from '../models/slashContext';

export default class Roll extends SlashCommand {
    constructor(client: AkenoClient) {
        super({
            client,
            slashData: new SlashCommandBuilder()
                .setName('roll')
                .setDescription('Rolls between 1 and X')
                .addIntegerOption((option) =>
                    option
                        .setName('sides')
                        .setDescription(
                            'The sides of the dice that will be rolled.'
                        )
                        .setRequired(true)
                ),
        });
    }

    async execute(ctx: SlashContext): Promise<boolean> {
        let number = Math.round(
            Math.random() *
                (ctx.interaction.options.getInteger('sides', true) - 1) +
                1
        );

        await ctx.reply({
            embeds: [
                new AkenoEmbed().setDescription(`You rolled \`${number}\``),
            ],
        });

        return true;
    }
}
