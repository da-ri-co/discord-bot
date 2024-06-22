import {GatewayIntentBits, Client, Partials, Message, Events, Collection, CommandInteraction, CommandInteractionOptionResolver, ChannelType} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, EndBehaviorType, createAudioResource, StreamType, getVoiceConnection, getGroups, getVoiceConnections } from "@discordjs/voice";

export const leave = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("leave and stop recording vc"),
    async execute(interaction: CommandInteraction) {
        const channel = (interaction.options as any).getChannel("channel");
        if (!channel) {
            await interaction.reply("No channel found");
            return;
        }

        const connections = getVoiceConnections('listener');
        if (connections === undefined) {
            await interaction.reply("No connection found");
            return;
        }
        for (const connection of connections) {
            connection[1].destroy();
        }
        await interaction.reply("Left the channel");
    }
};