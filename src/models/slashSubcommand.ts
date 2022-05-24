import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { APIApplicationCommandSubcommandOption } from 'discord-api-types/v9';
import { AkenoClient } from './client';
import CommandContext from './slashContext';

interface SlashSubcommandOptions {
    client: AkenoClient;
    slashData: SlashCommandSubcommandBuilder;
}

abstract class SlashSubcommand {
    constructor(options: SlashSubcommandOptions) {
        this.client = options.client;
        this.builder = options.slashData;
        this.slashData = this.builder.toJSON();
    }

    public client: AkenoClient;
    public builder: SlashCommandSubcommandBuilder;
    public slashData: APIApplicationCommandSubcommandOption;

    abstract execute(ctx: CommandContext): Promise<Boolean>;
}

export { SlashSubcommand, SlashSubcommandOptions };
