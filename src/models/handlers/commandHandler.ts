import { Message } from 'discord.js-light';
import { EventEmitter } from 'events';
import { AkenoClient } from '../client';
import { Command } from '../command';
import { CommandContext } from '../context';

export class CommandHandler extends EventEmitter {
    constructor(client: AkenoClient) {
        super();

        this.client = client;
    }

    public client: AkenoClient;
    public commands: Map<string, Command> = new Map();

    public registerCommand(command: Command) {
        this.commands.set(command.name, command);
        this.client.logger.info(`Registered command ${command.name}`);
    }

    public async handle(message: Message) {
        const content = message.content;
        const prefix = await this.client.getPrefix(message);
        const command = content.split(' ')[0];

        if (command.startsWith(prefix)) {
            const args = content
                .slice(prefix.length + command.length)
                .split(' ')
                .filter((arg) => arg.length > 0);
            const commandInstance = this.commands.get(
                command.slice(prefix.length)
            );

            if (commandInstance) {
                const ctx = new CommandContext(
                    this.client,
                    message,
                    commandInstance,
                    args
                );

                this.emit('command', ctx);

                if (commandInstance.checks.length > 0) {
                    for (const check of commandInstance.checks) {
                        if (!(await check(ctx))) {
                            return;
                        }
                    }
                }

                try {
                    await commandInstance.execute(ctx, args);
                } catch (err) {
                    if (err instanceof Error) {
                        this.client.logger.error(err.stack);
                    }
                }
            }
        }
    }

    public async handleCommand(
        command: Command,
        processedContent: string[],
        originalMessage: Message
    ) {
        if (command.subcommands.length > 0) {
            if (processedContent.length > 1) {
                const subcommand = command.subcommands.find(
                    (c: Command) => processedContent[1].toLowerCase() === c.name
                );

                if (subcommand) {
                    await this.handleCommand(
                        subcommand,
                        processedContent.slice(1),
                        originalMessage
                    );

                    return;
                }
            }
        }

        const ctx = new CommandContext(
            this.client,
            originalMessage,
            command,
            processedContent
        );

        this.emit('command', ctx);

        if (command.checks.length > 0) {
            for (const check of command.checks) {
                if (!(await check(ctx))) {
                    return;
                }
            }
        }

        try {
            await command.execute(ctx, processedContent.slice(1));
        } catch (err) {
            if (err instanceof Error) {
                this.client.logger.error(err.stack);
            }
        }
    }
}
