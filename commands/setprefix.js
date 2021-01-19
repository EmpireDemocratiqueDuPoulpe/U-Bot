const fs = require('fs');
const configFile = 'config.json';
const config = require('../' + configFile);

module.exports = {
    name: 'setprefix',
    id: 301,
    description: 'Change le préfix des commandes.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    usage: '[nouveau prefix]',
    isSetting: true,
    async execute(message, args) {
        config.prefix = args[0];

        const statusMsg = await message.channel.send("Mise à jour du préfix...");

        await fs.writeFile(configFile, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à changer le préfix. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Le préfix est désormais \`${config.prefix}\`. Les modifications devrait prendre effet d'ici dix secondes.`);
            console.log(`Changed prefix to ${config.prefix}.`);
        });
    },
};