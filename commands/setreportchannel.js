const fs = require('fs');
const fileName = 'config.json';
const configFile = require('../' + fileName);

module.exports = {
    name: 'setreportchannel',
    id: 304,
    description: 'Définie le salon où apparaît les signalements.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    usage: '#nomSalon',
    isSetting: true,
    async execute(message, args) {
        const channel = message.mentions.channels.first();

        // Check if the channel exist
        if (!channel) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai oublié de mentionner un salon, ${message.author}. Essaye comme ça :\n\`${configFile.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        // Check if the channel is a text channel
        if (channel.type !== "text") {
            return message.channel.send(`Uh oh! Il faut mentionner un salon textuel, ${message.author}. Je n'ai pas de langue 😔`);
        }

        configFile.report_channel = channel.id;

        const statusMsg = await message.channel.send("Mise à jour du salon de signalement...");

        await fs.writeFile(fileName, JSON.stringify(configFile, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à mettre à jour le salon de signalement. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Salon de signalement mis à jour !`);
            console.log('Updated report channel.');
        });
    },
};