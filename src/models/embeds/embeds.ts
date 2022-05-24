import { MessageEmbed } from 'discord.js-light';

export default class AkenoEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor('BLURPLE');
        this.setTimestamp();
    }

    error(e: Error): this {
        this.setColor('RED');
        this.setDescription(`\`${e.message}\`\n\`\`\`${e.stack}\`\`\``);
        return this;
    }
}
