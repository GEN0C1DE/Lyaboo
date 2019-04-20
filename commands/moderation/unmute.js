const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class UnMuteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
			aliases: ['havemouth', 'voiceboxhereus', 'granttyping'],
            group: 'moderation',
            memberName: "unmute",
            description: 'Will Un-Mute a User for [REASON].'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;
		
		let MutedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!MutedUser) return message.channel.send(":warning: Couldn't find user.");
		
		let Reason = Args.splice(2).join(" ");
		if (!Reason) Reason = "No Reason Provided!"
		
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":warning: You do not have permissions to do that.");
		if (MutedUser.hasPermission("MANAGE_MESSAGES")) return message.reply(":warning: This person can't be warned.");
		
		let MutedRole;
		
		Settings.Schemas.Mods.findOne({
			ServerID: message.guild.id
		}, async (Error, Results) => { 
			if(Error) console.log(Error);
			if(Results){
				if(Results.MutedRole){
					if(!message.guild.roles.find(`name`, `${Results.MutedRole}`)){
						try {
							MuteRole = await message.guild.createRole({
								name: `${Results.MutedRole}`,
								color: "#000000",
								permissions: []
							})
							message.guild.channels.forEach(async (channel, id) => {
								await channel.overwritePermissions(MuteRole, {
									SEND_MESSAGES: false,
									ADD_REACTIONS: false
								});
							});
						} catch(Error){
							console.log(Error.stack);
						}
					} else {
						MutedRole = message.guild.roles.find(`name`, `${Results.MutedRole}`)
					}
				} else {
					if(!message.guild.roles.find(`name`, `Muted`)){
						try {
							MuteRole = await message.guild.createRole({
								name: `Muted`,
								color: "#000000",
								permissions: []
							})
							message.guild.channels.forEach(async (channel, id) => {
								await channel.overwritePermissions(MuteRole, {
									SEND_MESSAGES: false,
									ADD_REACTIONS: false
								});
							});
						} catch(Error){
							console.log(Error.stack);
						}
					} else {
						MutedRole = message.guild.roles.find(`name`, `Muted`)
					}
				}	
				
				await (MutedUser.removeRole(MutedRole));

				if(Results.Logging === true){
					if(message.guild.channels.get(Results.LogsChannel)){
						let LoggingChannel = message.guild.channels.get(Results.LogsChannel);
						let RichEmbed = new Discord.RichEmbed()
						.setDescription("Member Unmuted!")
						.setColor("#ffffff")
						.setFooter(`Unmuted By <@${message.author.id}> with ID ${message.author.id}`)
						.addField("Unmuted User", `${MutedUser} with ID ${MutedUser.id}`)
						.addField("Unmuted In", message.channel)
						.addField("Reason", Reason);
						
						LoggingChannel.send(RichEmbed);
					}
				}	
			} 
		})		   
	}
}

module.exports = UnMuteCommand
