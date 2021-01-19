const fs = require('fs');
const configFile = 'config.json';

module.exports = {
    name: 'setadmingroups',
    id: 303,
    description: 'Ajoute ou supprime un groupe administrateur.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    usage: '[add/del] [nom du groupe]',
    isSetting: true,
    async execute(message, args) {
        const config = require(`../${configFile}`);
        const action = args[0];
        const groupName = args[1];

        // Check args
        if (!action ||!groupName) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai oublié les arguments, ${message.author}. Essaye comme ça :\n\`${config.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        if ((action !== "add" && action !== "del")) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai mal renseigné l'action, ${message.author}. Essaye comme ça :\n\`${config.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        // Get groups
        let groups = config.admin_groups;

        // Add group
        if (action === "add") {
            groups.push({"name": groupName, "added_by": message.author.tag})
        // Delete group
        } else if (action === "del") {
            const group_id = groups.map(function (g) { return g.name; }).indexOf(groupName);
            groups.splice(group_id, 1);
        }

        const statusMsg = await message.channel.send("Mise à jour des groupes administrateurs...");

        await fs.writeFile(configFile, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à mettre à jour les groupes administrateurs. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Groupes administrateurs mis à jour ! Les modifications devrait prendre effet d'ici dix secondes.`);
            console.log('Updated admin groups.');
        });
    },
};