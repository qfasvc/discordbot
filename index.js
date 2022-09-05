
require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
const quiz = require("./json/quiz.json");
const huquiz = require('./json/huquiz');
const { join } = require('path');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
      name: `!인물퀴즈`,
      type: 'PLAYING'
    },
    status: 'online'
  });
});

const convertEmoji = (who) => {
  if (who === "가위") {
    return "👉";
  }
  else if (who === "바위") {
    return "👊";
  }
  else if (who === "보") {
    return "✋";
  }
}


client.on('message', message => {
  if (message.author.bot) return; // 무한방지 코드
  if (message.author.id === client.user.id) return; // 로그인한 봇으로 채팅 입력 방지

  if (message.content.startsWith('!전적')) {
    require('./commands/opgg.js')('!전적', message);
  }
  
  if (message.content.startsWith('!롤체')) {
    require('./commands/tft.js')('!롤체', message);
  }
  
  if (message.content.startsWith('!배그')) {
    require('./commands/pubg.js')('!배그', message);
  }  
  
  if (message.content.startsWith('!이터널리턴')) {
    require('./commands/er.js')('!이터널리턴', message);
  }

  if (message.content === "!퀴즈") {
    require('./commands/quiz')(message, quiz);
  }
  if (message.content === "!인물퀴즈") {
    require('./commands/humanquiz')(message, huquiz);
  }

  if (message.content.substring(0, 3) === "!투표") {

    const description = message.content.substring(3);


    const embed = new Discord.MessageEmbed()
      .setTitle(" 👇 투표합시다 ")
      .setDescription(description)
      .setColor("#7E00BF");

    message.channel.send(embed)
      .then((msg) => {
        msg.react("👍")
        msg.react("👎")
      });
  }

  const id = message.author.id; // 유저의 고유 아이디
  const name = message.author.username; // 유저의 이름 (닉네임)

  const filePath = `./data/${id}.json`; // 유저 정보가 만들어지는 파일

  //TODO 파일이 없다면 파일을 생성해야함
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({})); // 파일이 있다면

  //파일을 읽어서 user에 저장
  const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  //오늘 날짜를 만든다
  const today = new Date();
  const data = "" + today.getFullYear() + today.getMonth() + today.getDate();

  //돈을 얼마나 지급할까
  const howMuch = 5000; //봇이 하루만에 만원을 주는 로직을 만들거임!
  if (message.content === "돈 줘") {//돈 줘 라고 입력하면 만원을 줄꺼임
    let saveUser = {}; // 유저 정보를 업데이트 할 변수
    if (user.id) {//파일에 유저 정보가 있다면
      if (user.data === data) {// 유저 정보의 일자랑 오늘이랑 같다면
        message.reply('쳐 받았잖아 씹새야');
        saveUser = user; // 유저 정보를 바꾸지 않고 저장할꺼임
      }
      else { //일자가 다르다면 (과거에 받고 오늘 안받았으면)
        message.channel.send(`${howMuch}원이 지급됬어!\n${name}의 현재 잔액은 ${user.money} -> ${user.money + howMuch}이야!`);
        saveUser = {
          //여기에 갱신할 유저정보를 집어넣자
          id: id, //아이디는 그대로
          name: name, // 닉네임 그대로
          date: data, // 일자는 오늘일자(date: 오늘일자)
          money: user.money + howMuch, // 돈을 만원을 지급해야함
          point: 0,
        }
      }
    }
    else {// 유저정보가 없다면(새로운 유저)
      message.reply(`${name}!! 시작하는걸 환영해! ${howMuch}원이 지급됐어!`);
      saveUser = { id, name, data, money: howMuch, point }; // 돈은 기존 돈에 추가하는게 아니라 무조건 10000원
    }
    //파일에 saveUser를 저장해야함 
    fs.writeFileSync(filePath, JSON.stringify(saveUser)); // 새로운 정보를 파일에 쓰기
  }

  if (message.content === "내 잔액") {
    user.id ? message.reply(`${name}의 현재 잔액은 ${user.money}원임`) : message.reply(`등록되지 않는 유저야 돈 줘 라고 입력해봐`);
  }
  if (message.content === '!내 점수') {
    user.point ? message.reply(`${name}의 현재 점수는 ${user.point}점 입니다`) : message.reply(`등록되지 않은 유저야 !인물퀴즈 로 인물퀴즈를 한뒤 다시 입력해봐`);
  }
  if (message.content === '무한') {
    message.channel.send('무야호');
  }
  if (message.content === '무야호') {
    message.channel.send('무야호');
  } 
  if (message.content === 'ping') {
    const embed = new Discord.MessageEmbed()
    .setTitle(`🏓 pong! ${client.ws.ping}ms`)
    .setColor('RANDOM');
  return message.channel.send(embed);
}
  if (message.content === '핑') {
    const embed = new Discord.MessageEmbed()
      .setTitle(`🏓 퐁 ${client.ws.ping}ms`)
      .setColor('RANDOM');
    return message.channel.send(embed);
  }

  if (message.content === '화1') {
      const embed = new Discord.MessageEmbed()
      .setTitle('화요일 1교시는 D밴드 입니다.')
      .setDescription('전진욱님의 화요일 1교시는 인공지능과 미래사회 입니다.')
      .addField("선생님", "설희준")
      .addField("장소", "컴퓨터실")
      .setColor('RED')
    return message.channel.send(embed);
  }

  if (message.content === '화2') {
    const embed = new Discord.MessageEmbed()
    .setTitle('화요일 2교시는 D밴드 입니다.')
    .setDescription('전진욱님의 화요일 2교시는 인공지능과 미래사회 입니다.')
    .addField("선생님", "설희준")
    .addField("장소", "컴퓨터실")
    .setColor('RED')
  return message.channel.send(embed);
}

if (message.content === '화3') {
    const embed = new Discord.MessageEmbed()
    .setTitle('화요일 3교시는 B밴드 입니다.')
    .setDescription('전진욱님의 화요일 3교시는 미적분 입니다.')
    .setColor('RED')
  return message.channel.send(embed);
}
if (message.content === '화4') {
  const embed = new Discord.MessageEmbed()
  .setTitle('화요일 4교시는 원반 입니다.')
  .setDescription('전진욱님의 화요일 4교시는 일본어 입니다.')
  .setColor('RED')
return message.channel.send(embed);
}

  // 입력한 값이 가위 또는 바위 또는 보일때
  if (message.content === "가위" || message.content === "바위" || message.content === "보") {
    const human = message.content; // 사람이 입력한 값을 human이라는 상수에 대입
    const list = ["가위", "바위", "보"]; // list[0] : 가위, list[1] : 바위, list[2] : 보
    const random = Math.floor(Math.random() * 3);     // 0~2 사이의 랜덤한 숫자

    const bot = list[random]; //가위, 바위, 보 중 랜덤한 하나를 bot에 대입


    let winner = ""; // 승자가 들어갈 변수 (let : 변수, const : 바꿀 수 없는 상수)

    //만약 사람이 낸거랑, 봇이 낸거랑 같다면
    if (human === bot) {
      winner = "비김";
    }
    else { //비기지 않았다면?
      human === "가위" ? (winner = bot === "바위" ? "봇" : "인간") : "";
      human === "바위" ? (winner = bot === "보" ? "봇" : "인간") : "";
      human === "보" ? (winner = bot === "가위" ? "봇" : "인간") : "";
      // 승자를 winner라는 변수에 넣어주는 로직!
    }
    // 결과 값을 만들어 봅시다!
    const result = `사람 :${convertEmoji(human)} vs 봇 : ${convertEmoji(bot)}\n${winner === "비김" ? "비김 ㅋ" : winner + "의 승리다"}`;
    message.reply(result);
  }
});

client.login(process.env.TOKEN||config.token);