import { PrismaClient } from '@prisma/client';
import {
    Client,
    Intents,
    Interaction,
    Message,
    Options,
} from 'discord.js-light';
import { Logger } from 'winston';
import { CommandHandler } from './handlers/commandHandler';
import SlashHandler from './handlers/slashHandler';
import MakeLogger from './utils/logger';

interface AkenoConfig {
    token: string;
    defaultPrefix: string;
    owners: string[];
    id: string;
}

export class AkenoClient extends Client {
    constructor(options: AkenoConfig) {
        super({
            // default caching options, feel free to copy and modify. more info on caching options below.
            makeCache: Options.cacheWithLimits({
                ApplicationCommandManager: 0, // guild.commands
                BaseGuildEmojiManager: 0, // guild.emojis
                GuildBanManager: 0, // guild.bans
                GuildInviteManager: 0, // guild.invites
                GuildMemberManager: 100, // guild.members
                GuildStickerManager: 0, // guild.stickers
                GuildScheduledEventManager: 0, // guild.scheduledEvents
                MessageManager: 0, // channel.messages
                PresenceManager: 0, // guild.presences
                ReactionManager: 0, // message.reactions
                ReactionUserManager: 0, // reaction.users
                StageInstanceManager: 0, // guild.stageInstances
                ThreadManager: 0, // channel.threads
                ThreadMemberManager: 0, // threadchannel.members
                UserManager: 0, // client.users
                VoiceStateManager: 0, // guild.voiceStates
            }),
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_WEBHOOKS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_BANS,
            ],
        });

        this.config = options;
        this.prisma = new PrismaClient();
        this.commandHandler = new CommandHandler(this);
        this.slashHandler = new SlashHandler(this);
        this.owners = options.owners;
    }

    public config: AkenoConfig;
    public prisma: PrismaClient;
    public logger: Logger = MakeLogger(`Shard-${this.shard?.ids[0]}`);
    public shardId?: number;
    public commandHandler: CommandHandler;
    public slashHandler: SlashHandler;
    public owners: String[];

    public async login(token: string): Promise<string> {
        // initialize stuff here

        this.on('messageCreate', async (message) => {
            const prefix = await this.getPrefix(message);
            const content = message.content;

            if (!content.startsWith(prefix)) {
                return;
            }

            const args = content
                .replace(prefix, '')
                .split(' ')
                .filter((s: string) => s !== '');

            const command = this.commandHandler.commands.get(args[0]);

            if (!command) {
                return;
            }

            this.logger.info(
                `(${message.author.username}#${message.author.discriminator}/${
                    message.guild ? message.guild.id : 'DM'
                }) ${message.content}`
            );

            return this.commandHandler.handleCommand(command, args, message);
        });

        this.on('interactionCreate', async (interaction: Interaction) => {
            this.slashHandler.handle.call(this.slashHandler, interaction);
        });

        await this.slashHandler.registerCommands();

        return await super.login(token);
    }

    public async getPrefix(msg: Message): Promise<string> {
        if (msg.guild !== null) {
            const result = await this.prisma.guild_settings.findUnique({
                where: {
                    guildID: msg.guild.id,
                },
            });

            if (result) {
                return result.prefix;
            } else {
                return this.config.defaultPrefix;
            }
        } else {
            return this.config.defaultPrefix;
        }
    }
}
