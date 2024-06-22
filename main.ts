// 必要なパッケージをインポートする
import {
    GatewayIntentBits,
    Client,
    Partials,
    Message,
    Events,
    Collection,
    CommandInteraction,
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
import {commands} from "./src/slashCommands";
// import { pingCommand } from './src/commands/ping';
// import {};
// import { audio}

import dotenv from "dotenv";

// .envファイルを読み込む
dotenv.config();

//Botで使うGatewayIntents、partials
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
});

const collection = new Collection<string, Command>();

// messageに反応するときの例
// client.on(Events.MessageCreate, async (message: Message) => {
//     if (message.author.bot) return;
//     if (message.content === "!time") {
//         const date1 = new Date();
//         message.channel.send(date1.toLocaleString());
//     }
// });

//スラッシュコマンド
// client.on(Events.InteractionCreate, async interaction => {
//     if (!interaction.isCommand()) return;

//     console.log(interaction);
//     const {commandName} = interaction;

//     if (commandName === "ping") {
//         await interaction.reply("Pong!");
//     }
// });

// command???
interface Command {
    data: {
        name: string;
        description: string;
    };
    execute: (interaction: CommandInteraction) => Promise<void>;
}

//スラッシュコマンドの設定
// const commands = [
//     new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Replies with Pong!'),
//     // Add more slash commands here if needed
//     new SlashCommandBuilder()
//         .setName("join")
//         .setDescription("join and record vc")
//         .addChannelOption(option =>
//             option
//                 .setName("channel")
//                 .setDescription("channel to join")
//                 .setRequired(true)
//                 .addChannelTypes(ChannelType.GuildVoice)
//     ),
// ];

// client ready
client.on(Events.ClientReady, async () => {
    // スラッシュコマンドの設定をDiscordに送信
    const commandsData = commands.map(command => command.data);
    await client.application?.commands.set(commandsData);
    // Ready表示
    console.log("Ready!");
    if (client.user) {
        console.log(client.user.tag);
    }
});

// スラッシュコマンドの処理
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    const command = interaction.commandName;

    try {
        const command = commands.find(
            command => command.data.name === interaction.commandName,
        );
        if (!command) {
            console.error("Command not found");
            return;
        }
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
    // Add more slash command handlers here if needed
});

// スラッシュコマンドの処理
// client.on(Events.InteractionCreate, async (interaction) => {
//     if (!interaction.isCommand()) return;
//     const command = interaction.commandName;

//     if (command === "ping") {
//         await interaction.reply("Pong!");
//     } else if (command === "join") {
//         // VCのストリーミングを取得
//         const channel = interaction.options.getChannel("channel");
//         if (!channel) {
//             await interaction.reply("Channel not found");
//             return;
//         }
//         if (channel.type !== "GUILD_VOICE") {
//             await interaction.reply("Channel is not a voice channel");
//             return;
//         }
//     }
// });

// ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);

console.log(process.env.TOKEN);
