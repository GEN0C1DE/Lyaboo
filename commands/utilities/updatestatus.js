const Commando = Depends.Commando
const Discord = Depends.Discord
const DevServer = Settings.DevServer

class UpdateCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'utilities',
            memberName: "update",
            description: 'Will update the status of the Bot.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let Args = message.content.split(" ")
        Args.splice(0, 1)
        let NewStatus = Args.join(" ")

        let Author = Number(message.author.id)
        if (Author == Number(DevServer.Developer)) {
            Settings.Status = NewStatus
            if (Settings.Testing === false) {
                Settings.Bot.user.setActivity(`${NewStatus}`, { type: "STREAMING" })
            };
            let Embed = new Discord.RichEmbed()
                .setColor("6e00ff")
                .setDescription(`Successfully updated status to: ${NewStatus}`);

            return message.channel.send(`<@${DevServer.Developer}>`, Embed)
        } else {
            let Embed = new Discord.RichEmbed()
                .setColor("276e00ff")
                .setDescription("You aren't allowed to use this Command!");
            message.channel.send(Embed).then(Message => Message.delete(5000))
            return
        }

    }
}

module.exports = UpdateCommand

