const Commando = Depends.Commando
const Discord = Depends.Discord
const DevServer = Settings.DevServer

class RefreshCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'refresh',
            group: 'utilities',
            memberName: "refresh",
            description: 'DEVELOPER: This will refresh the Bots Status.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let Author = Number(message.author.id)
        if (Author == Number(DevServer.Developer)) {
            if (Settings.Testing === false) {
                Settings.Bot.user.setActivity(`${Settings.Status}`, { type: "STREAMING" })
				return
            };
        } else {
            let Embed = new Discord.RichEmbed()
                .setColor("276e00ff")
                .setDescription("You aren't allowed to use this Command!");
            message.channel.send(Embed).then(Message => Message.delete(5000))
            return
        }

    }
}

module.exports = RefreshCommand

