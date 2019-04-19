const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class AddCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'mprocess',
			aliases: ['mprocess'],
			group: 'settings',
			memberName: "mprocess",
			description: 'Process for Viewing or Setting Up Moderation Settings. \n**Options:[view, set]**',
			examples: ['=mprocess view', '=mprocess set true CHANNELID']
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (message.member.hasPermission('ADMINISTRATOR')) {
			let Args = message.content.split(" ")
			Mongoose.connect(Settings.Connection + "\Moderation", {useNewUrlParser: true })
			.catch(Error => {
				console.error(Error)
			})
			
			if (Args[1] == "set"){
				let Bool;
				if (Args[2] === "true") {
					Bool = true
				} else {
					Bool = false
				};
				
				let SuggestionChannel = message.guild.channels.get(Args[3]);
				if (!SuggestionChannel) return message.channel.send(":x: Logging Channel Id Invalid!")

				Settings.Schemas.Mods.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results){
						let Suggestion = new Settings.Schemas.Mods({
							ServerID: message.guild.id,
							Logging: Bool,
							LogsChannel: Args[3]
						})
						Suggestion.save().catch(Error => console.log(Error))
					} else {
						Results.Logging = Bool;
						Results.LogsChannel = Args[3];
						Results.save().catch(Error => console.log(Error))
					}
				})
				
			
				let RichEmbed = new Discord.RichEmbed()
					.setTitle("Moderation Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("ENABLED", `${Args[2]}`)
					.addField("LOG CHANNEL", `${Args[3]}`)
					.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);	
			}
			if (Args[1] == "view"){
				Settings.Schemas.Mods.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(1000))
					
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Viewing the Moderation Settings for the Server.")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("Server ID (Pre-Set)", `${Results.ServerID}`)
					.addField("Is Enabled?", `${Results.Logging}`)
					.addField("Record Channel", `${Results.LogsChannel}`)
					.setTimestamp();
					return message.channel.send(RichEmbed);	
				})
			}
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = AddCommand
