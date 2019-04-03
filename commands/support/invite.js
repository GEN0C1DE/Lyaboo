const Commando = Depends.Commando
const Discord = Depends.Discord

class InviteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'invite',
			aliases: ['botinvite', 'serverinvite'],
            group: 'support',
            memberName: "invite",
            description: 'Returns the Server and Bot Invites to User.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let Bot_Embed = new Discord.RichEmbed()
        .setColor("6e00ff")
        .setThumbnail("https://cdn.discordapp.com/avatars/513448452987027478/0693b8c4738c0da560cce2ce0aa97802.png?size=256")
        .setTimestamp()
        .addField("Server Invite", "https://discord.gg/K8V8zJ3 or https://discord.me/Zulinghu")
		.addField("Bot Invite", "https://discordapp.com/oauth2/authorize?client_id=513448452987027478&scope=bot&permissions=8 **Please note when adding this bot to your server, that updates may happen anytime.**");
        message.author.send(Bot_Embed);
		message.channel.send(":white_check_mark: Please Check Direct Messages for More Information. If you didn't receive any messages, it's because your DM's are disabled.");
        return;
    }
}

module.exports = InviteCommand