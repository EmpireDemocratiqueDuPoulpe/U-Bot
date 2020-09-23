const fs = require('fs');
const fileName = 'config.json';
const configFile = require('../' + fileName);

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
        const action = args[0];
        const groupName = args[1];

        // Check args
        if (!action ||!groupName) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai oublié les arguments, ${message.author}. Essaye comme ça :\n\`${configFile.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        if ((action !== "add" && action !== "del")) {
            return message.channel.send(`Uh oh! Il semblerait que tu ai mal renseigné l'action, ${message.author}. Essaye comme ça :\n\`${configFile.prefix}${module.exports.name} ${module.exports.usage}\``);
        }

        // Get groups
        let groups = configFile.admin_groups;

        // Add group
        if (action === "add") {
            groups.push({"name": groupName, "added_by": message.author.tag})
        // Delete group
        } else if (action === "del") {
            const group_id = groups.map(function (g) { return g.name; }).indexOf(groupName);
            groups.splice(group_id, 1);
        }

        const statusMsg = await message.channel.send("Mise à jour des groupes administrateurs...");

        await fs.writeFile(fileName, JSON.stringify(configFile, null, 2), (err) => {
            if (err) {
                statusMsg.edit("Uh oh, je n'arrive pas à mettre à jour les groupes administrateurs. C'est que je suis mal fait dis donc !");
                return console.error(err);
            }

            statusMsg.edit(`Groupes administrateurs mis à jour !`);
            console.log('Updated admin groups.');
        });
    },
};