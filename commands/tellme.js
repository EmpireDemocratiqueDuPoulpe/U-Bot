const util = require('util')

module.exports = {
    name: 'tellme',
    id: 3,
    description: 'Répond à n\'importe laquelle de vos questions.',
    args: true,
    guildOnly: false,
    adminOnly: false,
    usage: '[question]',
    isSetting: false,
    async execute(message, args) {
        const answers = [
            ['Non %s.', 'Impossible %s !', 'Aucune chance %s.', 'Je n\'y crois pas %s.', 'Oui et puis mon code c\'est de l\'assembleur, %s !'],
            ['Peut-être %s.', 'Je ne pense pas %s.', 'Je ne suis pas sûr %s.', 'Vous pensez que ce soit possible %s ?', 'Pourquoi pas %s ?'],
            ['Oui %s.', 'Oh c\'est sûr même %s !', 'J\`y mettrais mon code à couper %s !', 'MAIS C\'ÉTAIT SÛR EN FAIT %s !', 'C\'est un secret %s (c\'est oui la réponse).']
        ];

        const answerType = Math.round(Math.random() * (answers.length - 1))
        const answerText = Math.round(Math.random() * (answers[answerType].length - 1))

        message.channel.send(`${util.format(answers[answerType][answerText], message.author.toString())}`)
    },
};