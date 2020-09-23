module.exports = {
    name: 'kick',
    id: 100,
    description: 'Expulse un membre.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    usage: '@nomUtilisateur (raison)',
    isSetting: false,
    async execute(message, args) {
        const { inviteURL } = require('../config.json');

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(" ");

        // No mentions
        if (!user) {
            return message.channel.send(`Uh oh! Il semblerait que tu n'ai pas mentionné d'utilisateur, ${message.author}.`);
        }

        const member = message.guild.member(user);

        // No member found
        if (!member) {
            return message.channel.send(`Uh oh! Il semblerait que l'utilisateur n'est pas sur ce serveur, ${message.author}.`);
        }

        await user.send(
            `Il semblerait que tu te sois fait expulser du serveur **${message.guild.name}** par **${message.author.username}**${reason ? ` pour "${reason}"` : ""}.` +
            `Tu peux, normalement, rejoindre le serveur mais plus de bêtises cette fois-ci.\n` +
            `${inviteURL}`
        );

        member.kick()
            .then(() => {
                message.channel.send(`L'utilisateur ${user.displayName} s'est fait expluser${reason ? ` pour "${reason}"` : ""}.`);
            }).catch(e => {
                console.error(`Cannot kick user "${user.displayName}": ${e}`);
                message.reply(`uh oh! Je ne peux pas expluser **${user.displayName}**.`);
            });
    }
};