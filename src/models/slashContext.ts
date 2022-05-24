import {
    CommandInteraction,
    Guild,
    GuildMember,
    InteractionReplyOptions,
    MessagePayload,
    User,
} from 'discord.js-light';
import { AkenoClient } from './client';
import SlashCommand from './slashCommand';

export default class CommandContext {
    constructor(
        author: User,
        interaction: CommandInteraction,
        command: SlashCommand,
        client: AkenoClient,
        guild?: Guild,
        member?: GuildMember
    ) {
        this.author = author;
        this.interaction = interaction;
        this.command = command;
        this.guild = guild;
        this.member = member;
        this.client = client;
    }

    static async setup(
        interaction: CommandInteraction,
        command: SlashCommand,
        client: AkenoClient
    ): Promise<CommandContext> {
        let guild;
        let member;
        let author;

        if (interaction.guild) {
            guild = interaction.guild;
            member = await guild.members.fetch(interaction.user.id);
        }

        author = interaction.user;

        return new this(author, interaction, command, client, guild, member);
    }

    public guild?: Guild;
    public member?: GuildMember;

    public author: User;

    public interaction: CommandInteraction;
    public command: SlashCommand;
    public client: AkenoClient;

    async reply(options: string | MessagePayload | InteractionReplyOptions) {
        return await this.interaction.reply(options);
    }
}
