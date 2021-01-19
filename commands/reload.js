module.exports = {
    name: 'reload',
    id: 200,
    description: 'Recharge une commande.',
    args: true,
    guildOnly: true,
    adminOnly: true,
    cooldown: 3,
    aliases: [ 'r' ],
    usage: '[nomCommande]',
    isSetting: false,
    execute(message, args) {
        // Get the command
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`Uh oh! Il semble que cette commande n'existe pas ${message.author}.`);
        }

        // Delete the cached command file
        delete require.cache[require.resolve(`./${command.name}.js`)];

        // Import the new command file
        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        }
        catch (e) {
            console.error(`Cannot reload "${command.name}" command: ${e}`);
            message.channel.send(`Uh oh! Il y a eu un problème pendant le rechargement de la commande \`${command.name}\`.`);
        }

        message.channel.send(`La commande \`${command.name}\` a bien été rechargée.`);
    },
};