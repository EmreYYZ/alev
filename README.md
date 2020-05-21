# 🔥 Alev 
- - -
A highly customized Twitch chat bot being used by my Twitch channel EmreCA. Made the repo public after many requests from my viewers.

The bot currently uses TMI.js so you may need to look at its docs on how to generate a oAuth token and so on. Without one, the code won't work. Reading Twitch API docs would also help because the bot directly uses twitch api for some commands.
 
The bot pulls the tv show, movie and suggestion data from the Trakt.TV API. 

## Commands
- - -
### 💤 Static
- - -
#### Social  
`!discord`, `!instagram`, `!twitter`, `!trakt`, `!portfolio`  
#### Channel  
`!komutlar` to show all commands available for regular users.  
#### Fun
`!jahrein`

### 🚀 Dynamic
- - -
#### Entertainment
`!oneri` pulls a random movie from EmreCA's recommendation list on Trakt.TV.  
`!film` tells the last movie EmreCA has watched.  
`!dizi` tells the last tv episode EmreCA has watched.  

#### Mod-only

`!baslik {title}` changes the stream title.  
`!oyun {game}` changes the stream game.

## 📃 To-do List
- - -
- [x] add a dynamic generic-command-system for static commands.
- [x] add a movie history, tv show history, and movie recommendations commands.
- [x] !title and !game commands.
- [ ] add a working `!uptime` command
- [ ] add and randomize strings for `!jahrein`
- [ ] add command cooldown for some commands
- [ ] connect 🔥 Alev to Twitch's `Channel Reward` system somehow. So that the rewards can trigger commands.
- [ ] viewers can change the color of 💡 `Philips Hue` lightbulbs by claiming a channel reward with their reward points.
- [ ] make Discord great again!
- [ ] add 🔥 Alev to other channels (i.e. `Slothworks`) to reply to strings including `Casthane`, `f5uck`, and so on. 
- [ ] add an interface maybe?
