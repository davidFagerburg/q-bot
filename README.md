# q-bot
A Twitch Chat bot to welcome users to your stream and ask questions periodically to keep you talking

Commands can be run by the channel the bot is in or by any mod for that channel

## Commands:
#### !question
 - asks a random question
 
#### !timer
 - takes arguments
 - !timer clear removes all timers
 - !timer \<command\> \<integer\> runs the command every \<integer\> minutes

# To run bot locally:
- `npm install`
- set up your app with dev.twitch.tv
- authorize the app to use either your channel or a bot channel you own with the scopes channel:moderate, chat:read, and chat:edit
- create a `.env` file
- add values for `AUTH_TOKEN`, `BOT_NAME`, and `CHANNEL_NAME` to the `.env` file
