const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RankCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'daily',
			group: 'economy',
			memberName: "daily",
			description: "To gain daily Lyasuno's.",
			
			throttling: {
				usages: 1,
				duration: 86400
			}

		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		let Args = message.content.split(" ")
		Mongoose.connect(Settings.Connection + "\Level", {useNewUrlParser: true })
		.catch(Error => {
			console.log(Error)
		})
		
		let User = message.mentions.members.first() || message.author
		let Reward = 200;
		
		Settings.Schemas.Level.findOne({
			ServerID: message.guild.id,
			UserId: User.id
		}, (Error, Results) => {
			if (Error) return console.log(Error);
			if(!Results){
				let Level = new Settings.Schemas.Level({
					ServerID: Message.guild.id,
					UserId: Message.author.id,
					LevelNumber: 0,
					XPNumber: 0,
					MoneyNumber: Reward
				})
				Level.save().then(Results => console.log(Results)).catch(Error => console.log(Error))

				let Embed = new Discord.RichEmbed()
				.setColor("6e00ff")
				.setTitle(`Daily Reward`)
				.setDescription(`You have earned a daily reward of ${Reward} Lyasuno's`)
				.setThumbnail(User.displayAvatarURL || User.user.displayAvatarURL);
				
				return message.channel.send(`${User}`, Embed)
			} else {
				Results.MoneyNumber = Results.MoneyNumber + Reward
				Results.save().catch(Error => console.log(Error))

				let Embed = new Discord.RichEmbed()
				.setColor("6e00ff")
				.setTitle(`Daily Reward`)
				.setDescription(`You have earned a daily reward of ${Reward} Lyasuno's`)
				.setThumbnail(User.displayAvatarURL || User.user.displayAvatarURL);
				
				return message.channel.send(`${User}`, Embed)
			}
		})
		
	}
}

module.exports = RankCommand