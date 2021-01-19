const Discord = require('discord.js');

module.exports = {
    name: 'report',
    id: 50,
    description: 'Signaler un utilisateur.',
    args: true,
    guildOnly: true,
    adminOnly: false,
    usage: '[@nomUtilisateur] [raison]',
    isSetting: false,
    execute(message, args) {
        const { report_channel } = require('../config.json');
        const channel = message.guild.channels.cache.get(report_channel);

        if (report_channel === "" || !channel) {
            return message.channel.send(`Uh oh! L'option \`report_channel\` n'est pas définie. Contacte un membre du staff ${message.author}.`);
        }

        const reported_member = message.mentions.members.first();
        const reason = args.slice(1).join(" ");

        // No member found
        if (!reported_member) {
            return message.channel.send(`Uh oh! Il semblerait que tu n'ai pas mentionné d'utilisateur, ${message.author}.`);
        }

        // Check the reported member
        if (reported_member.user.tag === message.author.tag) {
            return message.channel.send(`Uh oh! Tu ne peux pas te signaler toi-même, ${message.author}. Va te repentir si tu pense avoir blessé ton prochain !`)
        } else if (reported_member.user.tag === message.client.user.tag) {
            return message.channel.send(`Uh oh! Alors comme ça tu veux **ME** signaler, ${message.author} ?! J'vais le dire à mon créateur !`)
        }

        if (!reason) {
            message.channel.send(`Uh oh! Tu dois fournir une raison à ton signalement, toi qui te reconnaîtras.`);
            return message.delete();
        }

        // Delete user message
        const author = message.author;
        message.delete();

        // Send report
        const reportEmbed = new Discord.MessageEmbed()
            .setColor('#e34027')
            .setTitle(`Utilisateur ${reported_member.user.tag} signalé`)
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setAuthor(author.tag, author.avatarURL())
            .setTimestamp()
            .addField("Raison", reason);

        channel.send(reportEmbed)
            .then(msg => msg.react('✅'))
            .then(mReac => {
                const filter = (reaction, user) => reaction.emoji.name === '✅';
                const collector = mReac.message.createReactionCollector(filter, { time: 86400000});

                // Collect
                collector.on('collect', (reaction, user) => {
                    const updatedEmbed = new Discord.MessageEmbed()
                        .setColor('#4fe327')
                        .setTitle(reportEmbed.title)
                        .setURL(reportEmbed.url)
                        .setAuthor(reportEmbed.author.name, reportEmbed.author.iconURL)
                        .setTimestamp()
                        .addFields(reportEmbed.fields);

                    reaction.message.edit(updatedEmbed).catch(e => console.error('Cannot update report embed: ', e));
                    reaction.message.reactions.removeAll().catch(e => console.error('Failed to clear reactions: ', e));
                });

                // End
                collector.on('end', (reaction, user) => {
                    const updatedEmbed = new Discord.MessageEmbed()
                        .setColor('#4fe327')
                        .setTitle(reportEmbed.title)
                        .setURL(reportEmbed.url)
                        .setAuthor(reportEmbed.author.name, reportEmbed.author.iconURL)
                        .setTimestamp()
                        .addFields(reportEmbed.fields);

                    mReac.message.edit(updatedEmbed).catch(e => console.error('Cannot update report embed: ', e));
                    mReac.message.reactions.removeAll().catch(e => console.error('Failed to clear reactions: ', e));
                });

            })
            .catch(e => {
                console.error(`${module.exports.name} command error: ${e}`)
            })

        author.send(`Ton signalement envers **"${reported_member.user.tag}"** a bien été pris en compte. Un membre du staff pourrait revenir vers toi si nécessaire.\nMerci.`)
            .then()
            .catch(e => {
                console.error(`${module.exports.name} command error: ${e}`)
            });
    }
};