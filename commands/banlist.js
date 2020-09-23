const Discord = require('discord.js');
const db = require('../db.js');

module.exports = {
    name: 'banlist',
    id: 102,
    description: 'Liste des membres banni depuis le bot.',
    args: false,
    guildOnly: true,
    adminOnly: false,
    usage: "(nom d'utilisateur)",
    isSetting: false,
    async execute(message, args) {
        const pool = db.get();
        const guild_id = message.guild.id;

        const attachment = new Discord.MessageAttachment('assets/pics/look.png', 'look.png');
        let banListEmbed;

        // Get banned users
        if (!args.length) {
            let banned_users = await pool.query('SELECT ban_id, ban_username, ban_bannedby FROM banned_users WHERE ban_guildid = ? LIMIT 20', [guild_id]);
            let banned_users_maxcount = await pool.query('SELECT COUNT(*) AS "count" FROM banned_users WHERE ban_guildid = ?', [guild_id]);

            banned_users = banned_users[0];
            let banned_users_count = banned_users.length;
            banned_users_maxcount = banned_users_maxcount[0];

            // Init message
            banned_users = banned_users.map(u => {
                u = Object.values(u).join(` | `);
                u = (u.length > 45) ? (u.substr(0, 45) + "...") : (u);

                return u;
            }).join('\n');

            banListEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(this.description)
                .setDescription(banned_users)
                .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                .setAuthor(message.client.user.username, message.client.user.avatarURL())
                .attachFiles([attachment])
                .setThumbnail('attachment://look.png')
                .setTimestamp()
                .setFooter(`${banned_users_count}/${banned_users_maxcount[0].count} - _banlist (nom d'utilisateur) pour plus de détail.`);
        } else {
            let user = args[0];
            let banned_user = await pool.query('SELECT ban_id, ban_username, DATE_FORMAT(ban_datetime, \'%d/%m/%Y - %H:%i:%s\') AS "ban_datetime", IFNULL(ban_duration, \'\') AS "ban_duration", ban_bannedby FROM banned_users WHERE ban_guildid = ? AND ban_username LIKE ? LIMIT 20', [guild_id, `%${user}%`]);
            banned_user = banned_user[0];

            if (!banned_user.length) {
                return message.channel.send(`Uh oh! Je n'ai trouvé aucun utilisateur appelé "${user}", ${message.author}.`);
            }

            // Init message
            banned_user = banned_user.map(u => {
                  return Object.values(u).join(` | `);
            }).join('\n');

            banListEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(this.description)
                .setDescription(banned_user)
                .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                .setAuthor(message.client.user.username, message.client.user.avatarURL())
                .attachFiles([attachment])
                .setThumbnail('attachment://look.png')
                .setTimestamp()
                .setFooter(`C'est beau hein ?`);
        }

        // Send message
        await message.channel.send(banListEmbed);
    }
};