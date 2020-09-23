const fs = require('fs');
const fileName = 'config.json';
const configFile = require('../' + fileName);

module.exports = {
    name: 'setinviteurl',
    id: 305,
    description: 'Change le lien d\'invitation.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    usage: '[nouvelle url]',
    isSetting: true,
    async execute(message, args) {
        configFile.inviteURL = args[0];

        const statusMsg = await message.channel.send("Mise à jour du lien d'invitation...");

        await fs.writeFile(fileName, JSON.stringify(configFile, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à changer le lien d'invitation. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Le lien d'invitation est désormais \`${configFile.inviteURL}\`.`);
            console.log(`Changed invite link to ${configFile.inviteURL}.`);
        });
    },
};