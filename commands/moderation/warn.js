const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class KickCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'warn',
			aliases: ['freezus', 'fine', 'ticket'],
            group: 'moderation',
            memberName: "warn",
            description: 'Will Warn a User for [REASON].'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;
		
		let WarnedUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
		if (!WarnedUser) return message.reply(":warning: Couldn't find user.");
		
		let Reason = Message = Args.splice(2).join(" ");
		if (!Reason) Reason = "No Reason Provided!"
		
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: You do not have permissions to do that.");
		if (WarnedUser.hasPermission("MANAGE_MESSAGES")) return message.reply(":warning: This person can't be warned.");
		
		let WarnAmounts;
		
		Settings.Schemas.Warns.findOne({
			ServerID: message.guild.id,
			UserID: WarnedUser.id
		}, (Error, Results1) => {
			if(Error) console.error(Error)
			if(!Results1){
				let NewWarn = new Settings.Schemas.Warns({
					ServerID: message.guild.id,
					UserID: WarnedUser.id,
					Warns: [[`Moderator: ${message.author.username}`, `Reason: ${Reason}`]]
				})
				NewWarn.save().catch(Error => console.error(Error))
				WarnAmounts = 1
			} else {
				Results1.Warns.push([`Moderator: ${message.author.username}`, `Reason: ${Reason}`])
				Results1.save().catch(Error => console.log(Error))
				WarnAmounts = 1 + Results1.Warns.size
			}
			
			Settings.Schemas.Mods.findOne({
				ServerID: message.guild.id
			}, (Error, Results2) => { 
				if(Error) console.error(Error);
				if(Results2){
					if(Results2.Logging === true){
						if(message.guild.channels.get(Results2.LogsChannel)){
							let LoggingChannel = message.guild.channels.get(Results2.LogsChannel);
							let RichEmbed = new Discord.RichEmbed()
							.setDescription("Member Warned!")
							.setFooter(`Warned By: ${message.author.username}`)
							.setColor("#ffe593")
							.addField("Warned User", `<@${WarnedUser.id}>`)
							.addField("Warned In", message.channel)
							.addField("Number of Warnings", WarnAmounts)
							.addField("Reason", Reason);
							LoggingChannel.send(RichEmbed)
						}
					}
					if(!Results2.WarnsBeforeKick === false){
						if(Results2.WarnsBeforeKick === WarnAmounts){
							message.guild.member(WarnedUser).kick(`Having ${Results2.WarnsBeforeKick} Warns, Automated by Lyaboo!`).catch(Error =>{
								return message.channel.send(`I was unable to kick ${WarnedUser} for Having ${Results2.WarnsBeforeKick} Warnings!`)
							});
							if(Results2.Logging === true){
								if(message.guild.channels.get(Results2.LogsChannel)){
									let LoggingChannel = message.guild.channels.get(Results2.LogsChannel);
									let RichEmbed = new Discord.RichEmbed()
									.setDescription("Member Kicked!")
									.setFooter(`Kicked By: Lyaboo(Automated)`)
									.setColor("#ffe593")
									.addField("Kicked User", `<@${WarnedUser.id}>`)
									.addField("Reason", `${Results2.WarnsBeforeKick} Warns Achieved`);
									return LoggingChannel.send(RichEmbed)
								}
							}
						}
					}
					if(!Results2.WarnsBeforeBan === false){
						if(Results2.WarnsBeforeBan === WarnAmounts){
							message.guild.member(WarnedUser).ban(`Having ${Results2.WarnsBeforeBan} Warns, Automated by Lyaboo!`).catch(Error =>{
								return message.channel.send(`I was unable to Ban ${WarnedUser} for Having ${Results2.WarnsBeforeBan} Warnings!`)
							});
							if(Results2.Logging === true){
								if(message.guild.channels.get(Results2.LogsChannel)){
									let LoggingChannel = message.guild.channels.get(Results2.LogsChannel);
									let RichEmbed = new Discord.RichEmbed()
									.setDescription("Member Banned!")
									.setFooter(`Banned By: Lyaboo(Automated)`)
									.setColor("#FF0000")
									.addField("Banned User", `<@${WarnedUser.id}>`)
									.addField("Reason", `${Results2.WarnsBeforeBan} Warns Achieved`);
									return LoggingChannel.send(RichEmbed)
								}
							}
						}
					}
				}
			})
		})
    }
}

module.exports = KickCommand
