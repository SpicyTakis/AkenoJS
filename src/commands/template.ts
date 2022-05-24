import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import { AkenoClient } from '../models/client';
import AkenoEmbed from '../models/embeds/embeds';
import SlashCommand from '../models/slashCommand';
import slashContext from '../models/slashContext';
import { SlashSubcommand } from '../models/slashSubcommand';

export default class Template extends SlashCommand {
    constructor(client: AkenoClient) {
        super({
            client,
            slashData: new SlashCommandBuilder()
                .setName('template')
                .setDescription(
                    'Creates, edits, views, or lists templates for your server.'
                ),
            subcommands: [new TemplateList(client)],
        });
    }

    async execute(ctx: slashContext): Promise<boolean> {
        await ctx.reply({
            embeds: [new AkenoEmbed().setDescription('Poggers command???')],
        });

        return true;
    }
}

class TemplateList extends SlashSubcommand {
    constructor(client: AkenoClient) {
        super({
            client,
            slashData: new SlashCommandSubcommandBuilder()
                .setName('list')
                .setDescription('Lists the templates for your guild')
                .toJSON(),
        });
    }

    async execute(ctx: slashContext): Promise<Boolean> {
        await ctx.reply({
            embeds: [new AkenoEmbed().setDescription('Poggers command???')],
        });

        return true;
    }
}
