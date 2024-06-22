const {SlashCommandBuilder, ChannelType} = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    EndBehaviorType,
    createAudioResource,
    StreamType,
} = require("@discordjs/voice");
const Prism = require("prism-media");
const {PassThrough} = require("stream");

export async function getStream(receiver, userId) {
    const receiver = connection.receiver;
    const voiceStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000,
        },
    });

    const raw = new PassThrough();
    const decoder = new prism.opus.Decoder({
        rate: 48000,
        channels: 1,
        frameSize: 960,
    });

    voiceStream.pipe(raw).pipe(decoder);

    recorder(raw);
}
