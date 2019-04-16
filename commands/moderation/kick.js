const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class KickCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'kick',
			aliases: ['k', 'kill', 'kamikaze'],
            group: 'moderation',
            memberName: "kick",
            description: 'Will kick a user for [REASON].'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let KickedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(Args[0]));
		if(!KickedUser) return message.channel.send(":warning: Couldn't find user.");
		
		let Reason = Args.join(" ").slice(22);
		if (!Reason) Reason = "No Reason Provided!"
		
		Settings.Schemas.Mods.findOne({
			ServerID: message.guild.id
		}, (Error, Results) => { 
			if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: You do not have permissions to do that.");
			if(KickedUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: This person can't be kicked.");
			message.guild.member(KickedUser).kick(Reason);
			
			if(Results){
				if(Results.Logging === true){
					if(message.guild.channels.get(Results.LogsChannel)){
						let LoggingChannel = message.guild.channels.get(Results.LogsChannel);
						let RichEmbed = new Discord.RichEmbed()
						.setDescription("Member Kicked!")
						.setColor("#27037e")
						.addField("Kicked User", `${KickedUser} with ID ${KickedUser.id}`)
						.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
						.addField("Kicked In", message.channel)
						.addField("Time", message.createdAt)
						.addField("Reason", Reason)
						.setFooter(`Brought to you by Lyaboo`);
						
						LoggingChannel.send(RichEmbed);
					}
				}
			}
		
		})
    }
}

module.exports = KickCommand
