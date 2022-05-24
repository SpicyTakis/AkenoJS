import { PermissionResolvable } from 'discord.js-light';
import { CommandContext } from './context';
import AkenoEmbed from './embeds/embeds';

export type Check = (ctx: CommandContext) => Promise<boolean>;

export default class CommandChecks {
    public static async Owner(ctx: CommandContext): Promise<boolean> {
        if (ctx.client.owners.includes(ctx.author.id)) {
            return true;
        }

        return false;
    }

    public static Permissions(permissions: PermissionResolvable): Check {
        return async (ctx: CommandContext) => {
            if (
                ctx.member!.permissions.has('ADMINISTRATOR') ||
                ctx.member!.permissions.has(permissions)
            ) {
                return true;
            } else {
                ctx.message.reply({
                    embeds: [
                        new AkenoEmbed().setDescription(
                            `You do not have the required permissions to use this command.`
                        ),
                    ],
                });
            }

            return false;
        };
    }

    public static async GuildOnly(ctx: CommandContext): Promise<boolean> {
        if (!ctx.guild) {
            ctx.message.reply({
                embeds: [
                    new AkenoEmbed().setDescription(
                        `This command can only be used in a server.`
                    ),
                ],
            });
            return false;
        }

        return true;
    }
}
