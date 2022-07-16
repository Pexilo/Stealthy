const { Event } = require("sheweny");

module.exports = class JTCListener extends Event {
  constructor(client) {
    super(client, "voiceStateUpdate", {
      description: "Join to create voice channel",
    });
  }

  async execute(oldState, newState) {
    /*
     * Explanation of the code:
     * An user can do 3 types of actions here:
     * 1. Join a voice channel:
     *   - If the user is not in a voice channel, and connect to the JTC channel, create a new channel and move the user to it
     *
     * 2. Leave a voice channel
     *  - If the user is in a JTC system voice channel, disconnect from it, and the number of users in the channel is 0, delete the channel
     *
     * 3. Change of voice channel:
     * - If the user is in a voice channel, and switch to another one, he can:
     *   - Switch to a JTC channel to create a new one
     *   - Switch to a already existing voice channel
     * - In the both cases the user will leave an old channel and join a new one.
     * So Stealthy need to make sure the old channel is (or not) empty of users, if it is delete it.
     *    Create a new one if the user goes to a JTC channel
     */

    const { member, guild } = newState;
    const fetchGuild = await this.client.getGuild(guild);

    const joinToCreate = fetchGuild.joinToCreate.channel;
    if (!joinToCreate) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const JTCsTab = fetchGuild.joinToCreate.activeChannels;

    // If the user is disconnected from a voice channel OR if the user changed voice channel
    if ((oldChannel && !newChannel) || (oldChannel && newChannel)) {
      let change = false;

      if (oldChannel && newChannel) change = true;

      // Get the channel the user was in
      let vc = await oldChannel.guild.channels.cache.get(oldChannel.id);

      // If the channel is empty and there is an existing entry of the channel in the database
      if (
        vc.members.size < 1 &&
        JTCsTab.filter((JTC) => JTC == oldChannel.id).length > 0
      ) {
        // Delete the empty channel and the entry in the database
        oldChannel.delete().catch(() => {});
        JTCsTab.splice(JTCsTab.indexOf(oldChannel.id), 1);
        await this.client.updateGuild(guild, {
          "joinToCreate.activeChannels": JTCsTab,
        });
        // If the user changed channel we want to make sure before stopping the process, where the user is connected to
        if (!change) return;
      }
    }

    // If the user connected to a voice channel OR if the user changed voice channel
    if (oldChannel !== newChannel && newChannel && newChannel == joinToCreate) {
      const channelNames = fetchGuild.joinToCreate.names;

      const maxBitrate = (await this.client.guilds.fetch(guild.id))
        .maximumBitrate;

      let voiceChannel;
      await guild.channels
        .create(this.client.searchRandom(channelNames)[0], {
          type: "GUILD_VOICE",
          parent: newChannel.parent,
          bitrate: maxBitrate,
        })
        .then(async (channel) => {
          voiceChannel = channel;
          voiceChannel.setVideoQualityMode(2); // 2 = Video Quality Mode: High => 720p
          JTCsTab.push(channel.id);
          setTimeout(
            () => member.voice.setChannel(channel).catch(() => {}),
            500
          );
          await channel.lockPermissions().catch(() => {});
        })
        .catch(() => {});

      await this.client.updateGuild(guild, {
        "joinToCreate.activeChannels": JTCsTab,
      });

      /* Cooldown system to avoid spam,
       * TODO: if the bot restart during this cooldown it could be a problem, need to be fixed
       */
      await newChannel.permissionOverwrites.edit(member, { CONNECT: false });
      setTimeout(() => newChannel.permissionOverwrites.delete(member), 5000);

      // if the user doesn't switch in the newly created channel in less than 3s delete it
      await this.client.Wait(3000);
      if (voiceChannel.members.size < 1) {
        voiceChannel.delete().catch(() => {});
        JTCsTab.splice(JTCsTab.indexOf(voiceChannel.id), 1);
        await this.client.updateGuild(guild, {
          "joinToCreate.activeChannels": JTCsTab,
        });
      }
    }
  }
};
