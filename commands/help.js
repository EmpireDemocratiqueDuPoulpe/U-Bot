const Discord = require('discord.js');

module.exports = {
    name: 'help',
    id: 1,
    description: 'Liste des commandes d\'U-Bot.',
    args: false,
    guildOnly: false,
    adminOnly: false,
    aliases: [ 'h' ],
    usage: '(nomCommande)',
    isSetting: false,
    execute: function (message, args) {
        const { prefix } = require('../config.json');

        const { commands } = message.client;
        const attachment = new Discord.MessageAttachment('assets/pics/look.png', 'look.png');
        const answerEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(this.description)
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setAuthor(message.client.user.username, message.client.user.avatarURL())
            .attachFiles([attachment])
            .setThumbnail('attachment://look.png')
            .setTimestamp()
            .setFooter('C\'est beau hein ?');

        // Show help of every commands
        if (!args.length) {

            answerEmbed.setFooter('# : commande administrateur');

            commands.forEach(command => {
                if (command.isSetting) return;
                answerEmbed.addField(`${command.adminOnly ? "# " : ""} **${prefix}${command.name}** ${command.usage || ""}`, command.description);
            });

            return message.author.send(answerEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;

                    message.reply('la liste des commandes est dans tes messages privés.')
                }).catch(e => {
                    console.error(`${module.exports.name} command error: ${e}`)
                    message.channel.send(`Uh oh! Il semblerait que je n'ai pas pu t'envoyer l'aide dans tes messages privés ${message.author}. Peut-être qu'ils sont désactivés ?`);
                });
        }

        // Show help of a specific command
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName)
            || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`Uh oh! Il semblerait que cette commande n'existe pas ${message.author}.`);
        }

        answerEmbed.setTitle(command.name)

        if (command.description) answerEmbed.addField('Description:', command.description, true);
        if (command.usage) answerEmbed.addField('Utilisation:', `${prefix}${command.name} ${command.usage}`, true);
        if (command.aliases) answerEmbed.addField('Alias:', command.aliases.join(', '), true);

        answerEmbed.addField('Délai d\'utilisation:', `${command.cooldown || 0} seconde(s)`, true);

        if (command.adminOnly !== undefined) answerEmbed.addField('Admin:', `${command.adminOnly ? "oui" : "non"}`, true);

        message.channel.send(answerEmbed).catch(err => console.error(err));
    },
};