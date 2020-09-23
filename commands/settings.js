const Discord = require('discord.js');

module.exports = {
    name: 'settings',
    id: 300,
    description: 'Liste des paramètres d\'U-Bot.',
    args: false,
    guildOnly: true,
    adminOnly: true,
    aliases: [ 's' ],
    isSetting: false,
    execute: function (message, args) {
        const { prefix } = require('../config.json');

        const {commands} = message.client;
        const attachment = new Discord.MessageAttachment('assets/pics/look.png', 'look.png');
        const answerEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(this.description)
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .attachFiles([attachment])
            .setThumbnail('attachment://look.png')
            .setTimestamp()
            .setFooter('C\'est beau hein');

        // Show every settings
        commands.forEach(command => {
            if (!command.isSetting) return;
            answerEmbed.addField(`**${prefix}${command.name}** ${command.usage || ""}`, command.description);
        });

        return message.channel.send(answerEmbed)
            .then()
            .catch(e => {
                console.error(`${module.exports.name} command error: ${e}`)
                message.channel.send(`Uh oh! Il semblerait que je n'ai pas pu t'envoyer la liste des paramètres ${message.author}.`);
            });
    },
};