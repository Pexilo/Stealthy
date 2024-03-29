<div align="center">
<img src="https://user-images.githubusercontent.com/67436391/182243493-2dbaf788-fb39-463b-bcb9-05303d7d4a7f.png" align="center">
  <a href="https://github.com/Pexilo/Stealthy/releases" target="_blank">
    <img alt="Version" src="https://img.shields.io/badge/version-1.2.4-blue.svg?cacheSeconds=2592000&style=for-the-badge" />
  </a>
  <a href="https://discord.com/api/oauth2/authorize?client_id=877249354954580059&permissions=1099932462166&scope=bot%20applications.commands" target="_blank">
    <img src="https://dcbadge.vercel.app/api/shield/877249354954580059?bot=true?&theme=blurple" />
  </a>
  <a href="https://github.com/Pexilo/Stealthy/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" />
  </a>
</div>

##

<a href="https://discord.com/api/oauth2/authorize?client_id=877249354954580059&permissions=1099932462166&scope=bot%20applications.commands" target="_blank">
    <img align="right" width="350" src="https://user-images.githubusercontent.com/67436391/184276761-0a3590c3-0822-463c-b93b-f429bb3c83f8.png">
</a>

> Lightweight and easy to use discord bot meant to enrich the lifestyle of your server.

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/62ce9585dd0c42e8af7b4c11e7fe456d)](https://www.codacy.com/gh/Pexilo/Stealthy/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Pexilo/Stealthy&utm_campaign=Badge_Grade)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Pexilo_Stealthy&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Pexilo_Stealthy)
[![wakatime](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/26f9558b-88a5-476d-8e46-70f3ee78ce18.svg?style=flat "Time spend since the 1.1.2")](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/26f9558b-88a5-476d-8e46-70f3ee78ce18)
  
  
# ⚠️ SOME FEATURES ARE DEPRECATED, PROJECT IS NO LONGER SUPPORTED

## 🐲 About Stealthy

Stealthy is my first ambitious personal project, it has been under development since August 2021 during my free time, in parallel of my studies. I've been interested in discord bots for a few years now, at first I was building some for personal servers, but I quickly got the wish to create a functional bot working on several servers. The main idea of this bot is to offer useful features for servers between friends or communities, while not taking over channels like some bots do, and being as easy to use as possible.

## ✨ Features

#### 🌞 Life enhancements

- Role Claim
- Join to Create
- Auto Role
- Discord activities
- Invite to my channel

#### 🛡️ Security & Moderation tools!

- Complete logging system
- Ban, kick, warm, mute users
- Blacklist, Verification protection
- Discord invites suppression
- Lock, slowdown, clear channels

#### ⚜️ Useful commands

- Get user avatar
- User, server, bot info
- Translate messages

#### Check at any time these features with `/help`

> Some of the above features are using context-menu system, try to right click on a message or a user, and select 'applications'.

## 🌎 Supported Languages

#### • ☕ English᲼᲼᲼᲼᲼᲼᲼᲼• 💃 Spanish
#### • 🥖 French᲼᲼᲼᲼᲼᲼᲼᲼• 🥨 Deutsch

> Thanks to Github Copilot for making most of the translations possible... 😵‍💫

Feel free to report any [bad translations](https://github.com/Pexilo/Stealthy/labels/translation)

## 📬 Future updates

- [x] 🤖 Discord `v14` / 🚀 Sheweny `v4` [`1.1.0`](https://github.com/Pexilo/Stealthy/releases/tag/1.1.0)
- [x] 💬 Languages support [`1.2.0`](https://github.com/Pexilo/Stealthy/releases/tag/1.2.0)
- [x] ⚒️ Better permissions [`1.2.2`](https://github.com/Pexilo/Stealthy/releases/tag/1.2.2)
- [ ] 🗂️ Multiple Role Claim, 🔉 Join to Create
- [ ] 🧮 Role Claim types _(reaction, select menu, buttons)_

##

### 🤝 Contributing

<a href="https://discord.com/api/oauth2/authorize?client_id=877249354954580059&permissions=1099932462166&scope=bot%20applications.commands" target="_blank">
    <img align="right" width="500" src="https://user-images.githubusercontent.com/67436391/184276761-0a3590c3-0822-463c-b93b-f429bb3c83f8.png">
</a>

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Pexilo/Stealthy/issues).

### 📝 License

[MIT License](https://github.com/Pexilo/Stealthy/blob/main/LICENSE)
Copyright (c) 2022 Pexilo

### 👏 Show your support

Simply give me a ⭐️ to support me! 😄

## ⚙️ Installation

### Requirements

- Node 16.9 or higher

- MongoDB cluster

1. Create an [account](https://account.mongodb.com/account/login)
2. Create a cluster
3. Connect it with "connect your application"
4. Copy your connection string
5. Replace `<password>` with your database access user password

- Deepl Auth Key

1. Create an account
2. Copy your [authentification key](https://www.deepl.com/fr/account/summary)

### Start the bot

- Clone the repo

```
git clone https://github.com/Pexilo/Stealthy.git
```

##### 🤖 BOT INVITE

1. Replace `<clientId>` with your bot Id

`https://discord.com/api/oauth2/authorize?client_id=<clientId>&permissions=1099932462166&scope=bot%20applications.commands`

2. Invite your bot with the above link to a desired server

_Note: Your bot must have all privileged gateway intents checked to work properly_

##### 🧾 ENV FILE

1. Replace content of `example.env`

```
TOKEN=your-bot-token
DEEPL_API_KEY=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX:fx
MONGO_URI=mongodb+srv://username:password@clusterName.xxxxx.mongodb.net/Data
```

2. Rename the file `example.env` > `.env`

##### 🚀 LAUNCH BOT

1. Install dependencies

```
npm install
```

2. Start the bot

```
node .
```

## 🦾 Powered by

<div align="center" style="display:flex;">
    <a href="https://discord.js.org/" target="_blank">
        <img alt="DiscordJs" src="https://user-images.githubusercontent.com/67436391/179405418-a3dd9886-725b-4ed3-9ca6-d1eb73e4a67d.png" />
    </a>
    <a href="https://sheweny.js.org/" target="_blank">
        <img alt="Sheweny" src="https://user-images.githubusercontent.com/67436391/179405417-eb4c8938-5abd-4a7c-a978-cac58a06707f.png" />
    </a>
    <a href="https://www.mongodb.com/" target="_blank">
        <img alt="MongoDB" src="https://user-images.githubusercontent.com/67436391/179426484-d3fb357a-4702-4785-b0e1-7dc443923dab.jpeg" />
    </a>
        <a href="https://www.deepl.com/" target="_blank">
        <img alt="DeeplAPI" src="https://user-images.githubusercontent.com/67436391/179426610-3bcc829f-a7b1-4ce0-a437-212ab4c8b6e1.png" />
    </a>
    <a href="https://inovaperf.fr/" target="_blank">
        <img alt="InovaPerf" src="https://user-images.githubusercontent.com/67436391/179405419-b84714c9-6e66-4ac8-9b7d-fd14795f69f4.png" />
    </a>
</div>
