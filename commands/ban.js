module.exports = {
    name: 'ban',
    id: 101,
    description: 'Banni un membre.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    usage: '@nomUtilisateur (raison)',
    isSetting: false,
    async execute(message, args) {
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
            `Il semblerait que tu te sois fait bannir du serveur **${message.guild.name}** par **${message.author.username}**${reason ? ` pour "${reason}"` : ""}.` +
            ` Si tu conteste ce bannissement, tu peux tenter de contacter **Empire Démocratique du Poulpe#5551**.`
        );

        member.ban()
            .then(() => {
                message.channel.send(`L'utilisateur ${user.displayName} s'est fait bannir${reason ? ` pour "${reason}"` : ""}.`);
            }).catch(e => {
                console.error(`Cannot ban user "${user.displayName}": ${e}`);
                message.reply(`uh oh! Je ne peux pas bannir **${user.displayName}**.`);
            });
    }
};