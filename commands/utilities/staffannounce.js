const Commando = Depends.Commando
const Discord = Depends.Discord
const DevServer = Settings.DevServer

class AnnounceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'staffannounce',
            group: 'utilities',
            memberName: "staffannounce",
            description: 'DEVELOPER: Will announce a message to the Home Discord Servers Staff Announcements Channel.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return; return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let Args = message.content.split(" ")
        Args.splice(0, 1)
        let Annoucee = Args.join(" ")

        let Author = Number(message.author.id)
        if (Author == Number(DevServer.Developer)) {
            let Guild = Settings.Bot.guilds.get(`${DevServer.GuildId}`)
            if (!Guild) return message.channel.send(":x: Couldn't Find DevServer Guild!")

            let Channel = Settings.Bot.channels.get(`${DevServer.StaffAnnouncementChannel}`)
            if (!Channel) return message.channel.send(":x: Couldn't Find DevServer Staff Announcements!")

        
            let Embed = new Discord.RichEmbed()
                .setColor("6e00ff")
                .setDescription(Annoucee);

            return Channel.send(`@everyone New Staff Announcement from Developer <@${DevServer.Developer}>`, Embed)
        } else {
            let Embed = new Discord.RichEmbed()
                .setColor("6e00ff")
                .setDescription("You aren't allowed to use this Command!");
            message.channel.send(Embed).then(Message => Message.delete(5000))
            return
        }
        
    }
}

module.exports = AnnounceCommand

