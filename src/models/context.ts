import { PrismaClient } from '@prisma/client';
import {
    DMChannel,
    Guild,
    GuildMember,
    Message,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
    User,
} from 'discord.js-light';
import { AkenoClient } from './client';
import { Command } from './command';

export class CommandContext {
    constructor(
        client: AkenoClient,
        message: Message,
        commandInstance: Command,
        args: string[]
    ) {
        this.client = client;
        this.prisma = client.prisma;

        this.message = message;
        this.channel = message.channel;
        this.author = message.author;
        this.guild = message.guild;
        this.command = commandInstance;
        this.args = args;
        this.member = message.member;
    }

    public client: AkenoClient;
    public prisma: PrismaClient;
    public command: Command;
    public args: string[];

    public message: Message;
    public channel:
        | DMChannel
        | PartialDMChannel
        | NewsChannel
        | TextChannel
        | ThreadChannel;
    public author: User;
    public member: GuildMember | null;
    public guild: Guild | null;
}
