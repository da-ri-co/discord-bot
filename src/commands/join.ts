import {
    GatewayIntentBits,
    Client,
    Partials,
    Message,
    Events,
    Collection,
    CommandInteraction,
    CommandInteractionOptionResolver,
    ChannelType,
} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    EndBehaviorType,
    createAudioResource,
    StreamType,
} from "@discordjs/voice";
import {PassThrough} from "stream";

export const join = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("join and record vc")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("channel to join")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice),
        ),
    async execute(interaction: CommandInteraction) {
        const channel = (interaction.options as any).getChannel("channel");
        if (!channel) {
            await interaction.reply("No channel found");
            return;
        }
        const connection = joinVoiceChannel({
            group: "listener",
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false,
        });
        console.log("Joined the channel");
        // const player = createAudioPlayer();
        // connection.subscribe(player);
        connection.receiver.speaking.on("start", userId => {
            console.log(`User ${userId} started speaking`);
            const audio = connection.receiver.subscribe(userId, {
                end: {
                    behavior: EndBehaviorType.AfterSilence,
                    duration: 1000,
                },
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play,
                },
            });
            const resource = createAudioResource(audio, {
                inputType: StreamType.Opus,
            });
            player.play(resource);
            connection.subscribe(player);
        });
        await interaction.reply("Joined the channel");
    },
};
