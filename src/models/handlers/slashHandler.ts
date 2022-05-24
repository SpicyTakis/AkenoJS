import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v9';
import { CommandInteraction, Interaction } from 'discord.js-light';
import { AkenoClient } from '../client';
import SlashCommand from '../slashCommand';
import CommandContext from '../slashContext';

export default class SlashHandler {
    constructor(client: AkenoClient) {
        this.client = client;
        this.rest = new REST({ version: '9' }).setToken(client.config.token);
        this.commands = new Map<String, SlashCommand>();
    }

    public client: AkenoClient;
    public commands: Map<String, SlashCommand>;
    public slashData: RESTPostAPIApplicationCommandsJSONBody[] = [];
    public rest: REST;

    async handle(interaction: Interaction) {
        if (
            !interaction.isCommand() &&
            !(interaction instanceof CommandInteraction)
        )
            return;

        const commandInstance = this.commands.get(interaction.commandName);

        this.client.logger.info(
            `(${interaction.user.username}#${interaction.user.discriminator}/${
                interaction.guild ? interaction.guild.id : 'DM'
            }) ${interaction.commandName}`
        );

        if (commandInstance) {
            if (commandInstance.subcommands.length > 0) {
                const subname = interaction.options.getSubcommand(false);

                if (subname) {
                    const subcommands = new Map(
                        commandInstance.subcommands.map((subcommand) => [
                            subcommand.slashData.name,
                            subcommand,
                        ])
                    );

                    const subcommand = subcommands.get(subname);

                    if (subcommand) {
                        return subcommand.execute(
                            await CommandContext.setup(
                                interaction,
                                commandInstance,
                                this.client
                            )
                        );
                    }
                }
            }

            return commandInstance.execute(
                await CommandContext.setup(
                    interaction,
                    commandInstance,
                    this.client
                )
            );
        }
    }

    async registerCommands() {
        await this.rest.put(Routes.applicationCommands(this.client.config.id), {
            body: this.slashData,
        });
    }

    async registerCommand(command: SlashCommand) {
        this.client.logger.info(
            `Registered slash command ${command.slashData.name}`
        );

        this.commands.set(command.slashData.name, command);
        this.slashData.push(command.slashData);
    }
}
