const fs = require('fs');
const Discord = require('discord.js');
const fileName = 'config.json';
const configFile = require('../' + fileName);

module.exports = {
    name: 'getadmingroups',
    id: 302,
    description: 'Liste des groupes administrateurs.',
    args: false,
    guildOnly: true,
    adminOnly: true,
    isSetting: true,
    async execute(message, args) {
        const { admin_groups } = require('../config.json');

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

        // Show every groups
        admin_groups.forEach(group => {
            answerEmbed.addField(group.name, `Ajouté par ${group.added_by}`);
        });

        return message.channel.send(answerEmbed)
            .then()
            .catch(e => {
                console.error(`${module.exports.name} command error: ${e}`)
                message.channel.send(`Uh oh! Il semblerait que je n'ai pas pu t'envoyer la liste des groupes administrateurs ${message.author}.`);
            });
    },
};