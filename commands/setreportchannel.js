const fs = require('fs');
const configFile = 'config.json';

module.exports = {
    name: 'setreportchannel',
    id: 304,
    description: 'Définit le salon où apparaissent les signalements.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    usage: '#nomSalon',
    isSetting: true,
    async execute(message, args) {
        const config = require('../' + configFile);
        const channel = message.mentions.channels.first();

        // Check if the channel exist
        if (!channel) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai oublié de mentionner un salon, ${message.author}. Essaye comme ça :\n\`${config.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        // Check if the channel is a text channel
        if (channel.type !== "text") {
            return message.channel.send(`Uh oh! Il faut mentionner un salon textuel, ${message.author}. Je n'ai pas de langue 😔`);
        }

        config.report_channel = channel.id;

        const statusMsg = await message.channel.send("Mise à jour du salon de signalement...");

        await fs.writeFile(configFile, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à mettre à jour le salon de signalement. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Salon de signalement mis à jour ! Les modifications devrait prendre effet d'ici dix secondes.`);
            console.log('Updated report channel.');
        });
    },
};