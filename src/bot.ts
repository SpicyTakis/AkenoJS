import 'dotenv/config';
import Roll from './commands/roll';
import Template from './commands/template';
import { AkenoClient } from './models/client';
import Eval from './models/defaultCommands/eval';
import Ping from './models/defaultCommands/ping';

if (!process.env.DISCORD_TOKEN) {
    console.error('No discord token found!');
    process.exit(1);
}

const client = new AkenoClient({
    token: process.env.DISCORD_TOKEN, //bot token
    defaultPrefix: process.env.DEFAULT_PREFIX || '!', //default prefix
    owners: process.env.OWNERS?.split(',') || [], //array of owners
    id: process.env.APPLICATION_ID || '952367372579250236',
});

client.commandHandler.registerCommand(new Eval(client));

client.slashHandler.registerCommand(new Roll(client));
client.slashHandler.registerCommand(new Ping(client));
client.slashHandler.registerCommand(new Template(client));

client.login(client.config.token);
