require('dotenv').config();
const questions = require('./questions');
const tmi = require('tmi.js');

const opts = {
    options: {
        debug: true
    },
    identity: {
        username: process.env.BOT_NAME,
        password: process.env.AUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
}

const client = new tmi.client(opts);
const intervals = [];
let lastMessageSent = Date.now();

const onMessage = (channel, context, msg, self) => {
    const command = getCommand(msg);
    switch (command) {
        case "question":
            if (context.mod || context.username === process.env.CHANNEL_NAME) {
                say(channel, getQuestion())
            }
            break;
            case "timer":
                if (context.username === process.env.CHANNEL_NAME || context.username === process.env.BOT_NAME) {
                    const args = msg.split(' ');
                    if (args[1] === 'clear') {
                        while (intervals.length) {
                            clearInterval(intervals.pop());
                        }
                        break;
                    }
                    if (args.length < 3) break;
                    onMessage(channel, context, `!${args[1]}`, self);
                    intervals.push(setInterval(() => { onMessage(channel, context, `!${args[1]}`, self); }, parseInt(args[2]) * 60 * 1000));
                }
                break;
        }
        if (self) return;
    }
        
client.on('message', onMessage);
client.on('join', welcome);

client.connect().catch(error => {
    console.log(error);
});

function getCommand(message) {
    const match = message.match(/^!\w+/);
    return match ? match[0].slice(1) : undefined
}

function say(channel, message) {
    if (Date.now() - lastMessageSent < 1000) {
        setTimeout(say(channel, message), 1000);
        return;
    }
    lastMessageSent = Date.now();
    client.say(channel, message);
}

function getQuestion() {
    const q = questions[Math.floor(Math.random() * questions.length)];
    return q;
}

function welcome(channel, user, self) {
    if (self) return;
    if (shouldNotWelcome(user)) return;
    const greetings = [
        `Welcome to the stream, @${user}!`,
        `@${user} just joined! Thanks for coming!`,
        `Glad you could come, @${user}`,
        `Welcome, @${user}. Join me, and together we can rule the universe.`,
        `@${user}, Good to see you!`
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    client.say(channel, greeting);
}

function shouldNotWelcome(user) {
    const noWelcomeList = [
        'tonnages',
        'academyimpossible',
        'gametrendanalytics',
        'bigpatrick3',
        'bigpatrickbot'
    ];
    const index = noWelcomeList.findIndex(o => o === user);
    return index >= 0;
}