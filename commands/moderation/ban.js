const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class BanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
			aliases: ['b', 'banish', 'hang', 'sentence', 'hell'],
            group: 'moderation',
            memberName: "ban",
            description: 'Will ban a user for [REASON].'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let BannedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(Args[0]));
		if(!BannedUser) return message.channel.send(":warning: Couldn't find user.");
		
		let Reason = Args.join(" ").slice(2);
		if (!Reason) Reason = "No Reason Provided!"
		
		Settings.Schemas.Mods.findOne({
			ServerID: message.guild.id
		}, (Error, Results) => { 
			if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: You do not have permissions to do that.");
			if(BannedUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: This person can't be kicked.");
			message.guild.member(BannedUser).ban(Reason);
			
			if(Results){
				if(Results.Logging === true){
					if(message.guild.channels.get(Results.LogsChannel)){
						let LoggingChannel = message.guild.channels.get(Results.LogsChannel);
						let RichEmbed = new Discord.RichEmbed()
						.setDescription("Member Banned!")
						.setColor("#27037e")
						.addField("Banned User", `${BannedUser} with ID ${BannedUser.id}`)
						.addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
						.addField("Banned In", message.channel)
						.addField("Reason", Reason)
						.setFooter(`Brought to you by Lyaboo`);
						
						LoggingChannel.send(RichEmbed);
					}
				}
			}
		
		})
    }
}

module.exports = BanCommand
