const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class SSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'ssetup',
			aliases: ['suggestsetup'],
			group: 'settings',
			memberName: "ssetup",
			description: 'Will change/add Suggestion Information to the database.'
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
			
			let Bool;
			
			if (Args[1] === "true") {
				Bool = true
			} else {
				Bool = false
			};
			
			let SuggestionChannel = message.guild.channels.get(Args[2]);
			let SuggestionLogs = message.guild.channels.get(Args[3]);
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
						SuggestionsChannel: Args[2],
						RecordChannel: Args[3]
					})
					Suggestion.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					Results.SuggestionsEnabled = Bool;
					Results.SuggestionsChannel = Args[2];
					Results.RecordChannel = Args[3];
					Results.save().catch(Error => console.log(Error))
				}
			})
			
		
			let RichEmbed = new Discord.RichEmbed()
				.setTitle("Suggestion Setup Complete!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("ENABLED", `${Args[1]}`)
				.addField("NORMAL CHANNEL", `${Args[2]}`)
				.addField("LOG CHANNEL", `${Args[3]}`)
				.setTimestamp();
			return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = SSetupCommand