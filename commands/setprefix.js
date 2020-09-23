const fs = require('fs');
const fileName = 'config.json';
const configFile = require('../' + fileName);

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
        configFile.prefix = args[0];

        const statusMsg = await message.channel.send("Mise à jour du préfix...");

        await fs.writeFile(fileName, JSON.stringify(configFile, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à changer le préfix. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Le préfix est désormais \`${configFile.prefix}\`.`);
            console.log(`Changed prefix to ${configFile.prefix}.`);
        });
    },
};