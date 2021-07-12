
const { MessageEmbed } = require('discord.js');

module.exports = function (message, quiz) {
    const item = quiz[Math.floor(Math.random() * quiz.length)];
    const limit = 10; //제한시간 
    const filter = (response) => {
      return item.answer.some((answer) => answer === response.content);
    }

    const embed = new MessageEmbed()
        .setTitle(`${item.question} (제한시간: ${limit} 초)`)
        .setImage((item.img) ? item.img : '')
        .setColor('#7E00BF');
    message.channel.send(embed)
      .then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: limit * 1000 })
          .then((collected) => {
            message.channel.send(`${collected.first().author} 👈정답!`)
            })
          .catch((err) => {
            message.channel.send("제한시간이 지났습니다")
          });
      });
}
