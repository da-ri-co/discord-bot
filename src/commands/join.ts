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
    AudioReceiveStream,
} from "@discordjs/voice";
import { OpusEncoder } from "@discordjs/opus";
import * as prism from 'prism-media';
import {PassThrough, Writable, WritableOptions} from "stream";
import { recorder } from "../transcribe/post";

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
                    duration: 100,
                },
            });
            console.log(audio);
            let stream: Buffer[] = [];
            audio.on("data", (chunk) => {
                console.log("data");
                const opusDecoder = new OpusEncoder(16000, 1);
                const pcmData = opusDecoder.decode(chunk);
                stream.push(pcmData);
                // console.log(stream);
            });
            audio.on("end", () => {
                console.log("end");
                const audioStream = Buffer.concat(stream);
                recorder(audioStream);
                // console.log(audioStream);
            });
            // const passThrough = new PassThrough();
            // const decoder = () as any;
            // audio.pipe(new prism.opus.Decoder({channels: 2, rate: 48000, frameSize: 960}));
            // audio.pipe(passThrough);
            // console.log(decoder);
            // const resource = createAudioResource(audio, {
            //     inputType: StreamType.OggOpus,
            // });
            // console.log(resource);
        });
        await interaction.reply("Joined the channel");
    },
};
