import { Check } from './checks';
import { AkenoClient } from './client';
import { CommandContext } from './context';

interface CommandOptions {
    client: AkenoClient;
    name: string;
    description: string;
    checks?: Check[];
    subcommands?: Command[];
}

abstract class Command {
    constructor(options: CommandOptions) {
        this.client = options.client;
        this.name = options.name;
        this.description = options.description;
        this.checks = options.checks || [];
        this.subcommands = options.subcommands || [];
    }

    public client: AkenoClient;
    public name: string;
    public checks: Check[];
    public description: string;
    public subcommands: Command[];

    // eventaully, arguement handling will be much better.
    abstract execute(ctx: CommandContext, args: string[]): Promise<boolean>;
}

export { Command, CommandOptions };
