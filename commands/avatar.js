const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    id: 3,
    description: 'Récupère l\'avatar d\'un utilisateur.',
    args: false,
    guildOnly: false,
    adminOnly: false,
    usage: '(@nomUtilisateur)',
    isSetting: false,
    async execute(message, args) {
        const mention = message.mentions.users.first()
        const responseEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .setTimestamp()
            .setFooter('C\'est beau hein ?');

        if (mention) {
            responseEmbed
                .setTitle(`Avatar de ${mention.username}`)
                .setImage(mention.avatarURL())
        } else {
            responseEmbed
                .setTitle(`Avatar de ${message.author.username}`)
                .setImage(message.author.avatarURL())
        }

        return message.channel.send(responseEmbed).catch(err => console.error(err));
    },
};