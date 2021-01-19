const db = require('../db.js');

module.exports = {
    name: 'ban',
    id: 101,
    description: 'Banni un membre.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    usage: '[@nomUtilisateur] (raison)',
    isSetting: false,
    async execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(" ");

        // Check if the author has mentioned somebody
        if (!member) {
            return message.channel.send(`Uh oh! Il semblerait que tu n'ai pas mentionné d'utilisateur, ${message.author}.`);
        }

        // Get required data before the ban
        const guildId = message.guild.id;
        const banAuthorTag = message.author.tag;
        const memberTag = member.user.tag;
        const memberId = member.user.id;

        // Delete author message
        message.delete();

        // Send ban message to the banned member
        if (!member.user.bot) {
            await member.send(
                `Il semblerait que tu te sois fait bannir du serveur **${message.guild.name}** par **${banAuthorTag}**${reason ? ` pour "${reason}"` : ""}.` +
                ` Si tu conteste ce bannissement, tu peux tenter de contacter le modérateur qui t'a banni. Attention cependant, toute faute ne peut être rachetée.`
            ).catch();
        }

        // Ban the member
        member.ban()
            .then(() => {
                // Send message to the channel
                message.channel.send(`L'utilisateur ${memberTag} s'est fait bannir${reason ? ` pour "${reason}"` : ""}.`);

                // Add ban to ban list
                module.exports.addToBanList(guildId, memberId, memberTag, reason, banAuthorTag);

            }).catch(e => {
                console.error(`Cannot ban user "${memberTag}": ${e}`);
                message.author.send(`Uh oh! Je ne peux pas bannir **${memberTag}**.`);
            }
        );
    },
    async addToBanList(guild_id, user_id, username, ban_reason, banned_by, duration = -1) {
        const pool = db.get();

        await pool.query(
            'INSERT INTO banned_users SET ban_guildid = ?, ban_userid = ?, ban_username = ?, ban_reason = ?, ban_duration = ?, ban_bannedby = ?',
            [guild_id, user_id, username, ban_reason, duration, banned_by]
        );
    }
};