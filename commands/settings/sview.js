const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'sview',
			aliases: ['suggestview'],
			group: 'settings',
			memberName: "sview",
			description: 'Views The Settings that are in the Database for the Suggestion System.'
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (message.member.hasPermission('ADMINISTRATOR')) {
			let Args = message.content.split(" ")
			Mongoose.connect(Settings.Connection + "\Roles", { useNewUrlParser: true })
			.catch(Error => {
				console.log(Error)
			})
			
			
			Settings.Schemas.Suggestion.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) console.log(Error);
				if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(1000))
				
				
				let RichEmbed = new Discord.RichEmbed()
				.setTitle("Viewing the Suggestion Settings for the Server.")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("Server ID (Pre-Set)", `${Results.ServerID}`)
				.addField("Is Enabled?", `${Results.SuggestionsEnabled}`)
				.addField("Suggestions Channel", `${Results.SuggestionsChannel}`)
				.addField("Record Channel", `${Results.RecordChannel}`)
				.setTimestamp();
				return message.channel.send(RichEmbed);	
			})
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RSetupCommand