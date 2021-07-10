const { MessageEmbed } = require('discord.js');

var start = false;

module.exports = function (message, quiz) {
    var skip = false;
    const item = quiz[Math.floor(Math.random() * quiz.length)];
    const limit = 15; //제한시간 
    const filter = (response) => {
      if (response.content == '몰라') {
        skip = true;
        return true;
      };
      return item.answer.some((answer) => answer === response.content);
    }

    const embed = new MessageEmbed()
        .setTitle(`이 사람은 누구 일까요? (제한시간 ${limit}초)`)
        .setImage((item.img) ? item.img : '')
        .setColor('#C8C8C8');
    if (!start) {
        start = true;
        message.channel.send(embed)
          .then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: limit * 1000 })
              .then((collected) => {
                if (skip) {
                  message.channel.send(`정답은 '${item.answer}' 였습니다`);
                } else {
                  message.channel.send(`${collected.first().author} 👈정답!`);
                }
                start = false;
              })
              .catch((err) => {
                message.channel.send(`제한시간이 지났습니다 정답은 '${item.answer}' 였습니다`);
                start = false;
              });
          });
    } else {
        message.channel.send('인물퀴즈가 진행 중 입니다.');
    }
}
