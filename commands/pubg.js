const { Message } = require('discord.js');

module.exports = function opgg(com = new String, message = new Message) {
    const args = message.content.slice(com.length).trim().split(/ +/g);
    if (args[0]) {
        return message.channel.send(`https://pubg.op.gg/user/${args.join('')}`);
    }
    return message.channel.send(`${com} [배그 이름]`);
}