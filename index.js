/****************************
 * IMPORT
 ****************************/

const fs = require('fs')
const Discord = require('discord.js')
const db = require('./db.js')

const configFile = './config.json';
let config = require(configFile);

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Discord.Collection();

/****************************
 * IMPORT COMMANDS
 ****************************/

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.commands = client.commands.sort((commandA, commandB) => commandA.id - commandB.id);

/****************************
 * OPEN DATABASE CONNECTION
 ****************************/

db.connect();

/****************************
 * ONCE STARTED
 ****************************/

client.once('ready', () => {
    console.log(`Bot started!\nUse "https://discord.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=8" to invite.`);
});

/****************************
 * ON MESSAGE
 ****************************/

client.on('message', message => {
    // Reject messages without prefix or sent by a bot.
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get the command module
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Check args
    if (command.args && !args.length) {
        let msg = `Il manque des arguments à la commande, ${message.author} !`;

        if (command.usage) {
            msg += `\nVous devriez essayer comme ça: \`${config.prefix}${commandName} ${command.usage}`;
        }

        return message.channel.send(msg);
    }

    // Check if the command can be executed in the DM
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.channel.send('Non mais tu es fou ma parole ! Je ne peux pas faire ça dans les messages privés, ça dépasse l\'entendement.');
    }

    // Check if it's an admin only command
    if (command.adminOnly) {
        const authorRoles = message.member.roles.cache;

        if (!authorRoles.some(role => { return hasAdminRole(role); })) {
            return message.channel.send('C\'est une commande administrateur. Dommage ¯\\_(ツ)_/¯');
        }
    }

    // Cooldown system.
    if (!cooldown.has(command.name)) {
        cooldown.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldown.get(command.name);
    const cooldownDuration = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownDuration;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Wow doucement ${message.author} ! Attend encore ${timeLeft} secondes avant d'utiliser à nouveau la commande ${commandName}.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownDuration);

    // Try to execute the command
    try {
        command.execute(message, args);
    }
    catch (e) {
        console.error(`Cannot execute "${command.name}" command: ${e}`);
        message.reply('Uh oh! La commande n\'a pas pu se terminer correctement.').then().catch();
    }
});

function hasAdminRole(userRole) {
    return config.admin_groups.find(role => role.name === userRole.name);
}

/****************************
 * CHECK FOR CONFIG FILE CHANGE
 ****************************/

let fsWait = false;

fs.watch(configFile, (event, fileName) => {
    if (fileName) {
        if (fsWait) return;

        fsWait = setTimeout(() => {
            fsWait = true;
        }, 10000);

        console.log(`File "${fileName}" changed. Reloading file...`);
        config = require(configFile)
    }
})

/****************************
 * LOGIN
 ****************************/

client.login(config.token).catch(err => console.error(err));