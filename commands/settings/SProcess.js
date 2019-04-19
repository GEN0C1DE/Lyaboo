const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class SSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'sprocess',
			aliases: ['sprocess'],
			group: 'settings',
			memberName: "sprocess",
			description: 'Setup Process for Changing, and Viewing, Suggestions Things for your Server.\n**Options:[set, view]**',
			examples: ['=sprocess view', '=sprocess set true SUGGESTION_CHANNEL_ID RECORD_CHANNEL_ID']
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (message.member.hasPermission('ADMINISTRATOR')) {
			let Args = message.content.split(" ")
			Mongoose.connect(Settings.Connection + "\Suggestions", {useNewUrlParser: true })
			.catch(Error => {
				console.log(Error)
			})
			
			if (Args[1] == "set"){
				let Bool;
				if (Args[2] === "true") {
					Bool = true
				} else {
					Bool = false
				};
				
				let SuggestionChannel = message.guild.channels.get(Args[3]);
				let SuggestionLogs = message.guild.channels.get(Args[4]);
				if (!SuggestionChannel) return message.channel.send(":x: Suggestions Channel Id Invalid!")
				if (!SuggestionLogs) return message.channel.send(":x: Suggestions Log Channel Id Invalid!");

				Settings.Schemas.Suggestion.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results){
						let Suggestion = new Settings.Schemas.Suggestion({
							ServerID: message.guild.id,
							SuggestionsEnabled: Bool,
							SuggestionsChannel: Args[3],
							RecordChannel: Args[4]
						})
						Suggestion.save().catch(Error => console.log(Error))
					} else {
						Results.SuggestionsEnabled = Bool;
						Results.SuggestionsChannel = Args[3];
						Results.RecordChannel = Args[4];
						Results.save().catch(Error => console.log(Error))
					}
				})
				
			
				let RichEmbed = new Discord.RichEmbed()
					.setTitle("Suggestion Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("ENABLED", `${Args[2]}`)
					.addField("NORMAL CHANNEL", `${Args[3]}`)
					.addField("LOG CHANNEL", `${Args[4]}`)
					.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);	
			}
			if (Args[1] == "view"){
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
			}
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = SSetupCommand