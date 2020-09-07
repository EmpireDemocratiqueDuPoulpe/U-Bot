module.exports = {
    name: 'ping',
    id: 2,
    description: 'Ping le bot.',
    args: false,
    guildOnly: false,
    adminOnly: false,
    cooldown: 3,
    aliases: [ 'pong' ],
    async execute(message, args) {
        const ping = await message.channel.send("Ping...");
        const ms = (ping.createdAt - message.createdAt);
        ping.edit(
                `Pong ! Voici mon ping:\n` +
                `**Serveur:** ${ms} ms\n` +
                `**API:** ${Math.round(message.client.ws.ping)} ms\n` +
                `**Uptime:** ${this.msToTime(message.client.uptime)}\n`
            )
            .then()
            .catch(e => {
                console.error(`${name} command error: ${e}`)
            }
        );
    },
    msToTime(ms) {
        const days = Math.floor(ms / 86400000);
        const daysMs = ms % 86400000;

        const hours = Math.floor(daysMs / 3600000);
        const hoursMs = ms % 3600000;

        const minutes = Math.floor(hoursMs / 60000);
        const minutesMs = ms % 60000;

        const sec = Math.floor(minutesMs / 1000);

        let str = "";
        if (days) str = str + days + "j";
        if (hours) str = str + hours + "h";
        if (minutes) str = str + minutes + "m";
        if (sec) str = str + sec + "s";

        return str;
    }
};