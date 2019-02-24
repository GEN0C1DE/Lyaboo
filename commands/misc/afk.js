const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class AFKCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'afk',
			aliases: ['away', 'setaway', 'eafk'],
			group: 'misc',
			memberName: "afk",
			description: 'Will make person go into a AFK status.'
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		Mongoose.connect(Settings.Connection + "\Users", {useNewUrlParser: true })
			.catch(Error => {
				console.log(Error)
			})
		
		message.delete(100)

		let Args = message.content.split(" ")
		let AReason = Args.slice(1).join(' ');
		if (!AReason) AReason = "AFK";
		
		Settings.Schemas.User.findOne({
			UserId: message.author.id
		}, (Error, Results) => {
				if (Error) console.log(Error);
				if(!Results){
					let User = new Settings.Schemas.User({
						UserId: message.author.id,
						IsAFK: true,
						Reason: AReason
					})
					User.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					Results.IsAFK = true;
					Results.Reason = AReason;
					Results.save().catch(Error => console.log(Error))
				}
				
				let RichEmbed = new Discord.RichEmbed()
				.setTitle("AFK Successful!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setDescription(`You have set your AFK to: ${AReason}`)
				.setTimestamp();
				return message.channel.send(`${message.author}`, RichEmbed).then(M =>  M.delete(5000));
			})

	}	
}

module.exports = AFKCommand