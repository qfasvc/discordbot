const { MessageEmbed, User } = require('discord.js');
const fs = require('fs');

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
        .setColor('#FFF500');
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

                  const id = message.author.id; // 유저의 고유 아이디
                  const name = message.author.username; // 유저의 이름 (닉네임)
                  const filePath = `./data/${id}.json`; // 유저 정보가 만들어지는 파일
                  
                  //파일을 읽어서 user에 저장
                  const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                  
                  const howMuch = 1; //봇이 하루만에 만원을 주는 로직을 만들거임!

                  let saveUser = {}; // 유저 정보를 업데이트 할 변수
                  if (user.id) {//파일에 유저 정보가 있다면
                    saveUser = {
                      //여기에 갱신할 유저정보를 집어넣자
                      id: user.id, //아이디는 그대로
                      name: user.name, // 닉네임 그대로
                      date: user.date, // 일자는 오늘일자(date: 오늘일자)
                      money: user.money,
                      point: (user.point) ? user.point + howMuch : howMuch, // 돈을 만원을 지급해야함
                    };
                  }
                  else {// 유저정보가 없다면(새로운 유저)
                    saveUser = { id: id, name: name, data: 0, money: 0, point: howMuch }; // 돈은 기존 돈에 추가하는게 아니라 무조건 10000원
                  }
                  //파일에 saveUser를 저장해야함
                  fs.writeFileSync(filePath, JSON.stringify(saveUser)); // 새로운 정보를 파일에 쓰기
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
