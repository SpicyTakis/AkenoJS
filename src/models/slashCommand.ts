import { SlashCommandBuilder } from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { AkenoClient } from './client';
import SlashContext from './slashContext';
import { SlashSubcommand } from './slashSubcommand';

interface SlashOptions {
    client: AkenoClient;
    slashData: SlashCommandBuilder;
    subcommands?: SlashSubcommand[];
}

export default abstract class SlashCommand {
    constructor(options: SlashOptions) {
        this.client = options.client;
        this.builder = options.slashData;
        this.subcommands = options.subcommands || [];

        this.slashData = this.toJSON();
    }

    public client: AkenoClient;
    private builder: SlashCommandBuilder;
    public slashData: RESTPostAPIApplicationCommandsJSONBody;
    public subcommands: SlashSubcommand[];

    abstract execute(ctx: SlashContext): Promise<boolean>;

    toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        for (const subcommand of this.subcommands) {
            this.builder.addSubcommand(subcommand.builder);
        }

        return this.builder.toJSON();
    }
}
