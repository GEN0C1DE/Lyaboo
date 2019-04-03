const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RankCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'rank',
			aliases: ['profile'],
			group: 'economy',
			memberName: "rank",
			description: "To check a User's rank globally."
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
		
		Settings.Schemas.Level.findOne({
			UserId: User.id
		}, (Error, Results) => {
			if (Error) return console.log(Error);
			if(!Results){
				let Embed = new Discord.RichEmbed()
				.setColor("6e00ff")
				.setTitle(`Now Showing Profile of ${User.username || User.user.username}`)
				.setDescription(`Data doesn't Exist.`)
				.setThumbnail(User.displayAvatarURL || User.user.displayAvatarURL);
				return message.channel.send(":warning: User not found in Database!", Embed)
			} else {
				let NextLevel = Results.LevelNumber * 300;
				let Embed = new Discord.RichEmbed()				
				.setColor("6e00ff")
				.setTitle(`Now Showing Profile of ${User.username || User.user.username}`)
				.setDescription(`Level: ${Results.LevelNumber}\nExperience: ${Results.XPNumber}/${NextLevel}\nBalance: ${Results.MoneyNumber}`)
				.setThumbnail(User.displayAvatarURL || User.user.displayAvatarURL);
				return message.channel.send(Embed)
			}
		})
		
	}
}

module.exports = RankCommand