/****************************
 * IMPORT
 ****************************/

const fs = require('fs');
const Discord = require('discord.js');
const AntiSpam = require('discord-anti-spam');
const configFile = './config.json';
let config = require(configFile);

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldown = new Discord.Collection();
const antiSpam = new AntiSpam({
    warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
    kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
    banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: '{@user}, le spam c\'est mal.', // Message that will be sent in chat upon warning a user.
    kickMessage: '**{user_tag}** a été expulsé pour spam.', // Message that will be sent in chat upon kicking a user.
    banMessage: '**{user_tag}** a été banni pour spam. Comment ose-t-il un acte d\'une cruauté telle ?', // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a kick.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a ban.
    exemptPermissions: [ 'ADMINISTRATOR' ], // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredUsers: [], // Array of User IDs that get ignored.
    ignoredRoles: ['720968009467953163', '720968036433133578', '724023583562530876', '724008727346413598'], // Array of string role IDs or role name that are ignored.
});

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
 * ONCE STARTED
 ****************************/

client.once('ready', () => {
    console.log(`Bot started!\nUse "https://discord.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=8" to invite.`);
});

/****************************
 * ON MESSAGE
 ****************************/

client.on('message', message => {
    antiSpam.message(message);

    // Reject messages without prefix or sent by a bot.
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

    // Get the command module
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Check args
    if (command.args && !args.length) {

        let msg = `Il manque des arguments à la commande, ${message.author} !`;

        if (command.usage) {
            msg += `\nVous devriez essayer comme ça: \`${prefix}${commandName} ${command.usage}`;
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
        }, 100);

        console.log(`File "${fileName}" changed. Reloading file...`);
        config = require(configFile);
    }
})

/****************************
 * LOGIN
 ****************************/

client.login(config.token);