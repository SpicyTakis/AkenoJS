import { Shard, ShardingManager } from 'discord.js-light';
import MakeLogger from './models/utils/logger';

async function main() {
    const manager = new ShardingManager('./dist/bot.js', {
        token: 'OTUyMzY3MzcyNTc5MjUwMjM2.Yi0_Ow.YbXUD3wKbpU0NG_ft1j6RRKwyJ4',
    });

    const logger = MakeLogger('ShardManager');

    manager.on('shardCreate', async (shard: Shard) => {
        shard.on('ready', async () => {
            logger.info(`Shard ${shard.id} is ready.`);
        });
    });

    manager
        .spawn({})
        .catch((error) =>
            logger.error(`[ERROR/SHARD] Shard failed to spawn: ${error}`)
        );
}

main();
