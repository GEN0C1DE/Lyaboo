const Commando = Depends.Commando
const Discord = Depends.Discord

class InviteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'support',
            memberName: "invite",
            description: 'Will return the Server Invite to User.'
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
            .addField("Invite", "https://discord.gg/K8V8zJ3");
        message.author.send(Bot_Embed);
        return;
    }
}

module.exports = InviteCommand