const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class LeaveCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'setleave',
			aliases: ['leavesetup'],
			group: 'roles',
			memberName: "setleave",
			description: 'Setting the Leave Message for people leaving.'
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (message.member.hasPermission('ADMINISTRATOR')) {
			let Args = message.content.split(" ")
			Mongoose.connect(Settings.Connection + "\Join", {useNewUrlParser: true })
			.catch(Error => {
				console.error(Error)
			})
			
			let Message;
			if (Args[1] === "false") {
				Message = false
			} else {
				Message = Args.splice(0, 1).join(" ")
			}

			Settings.Schemas.Join.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) return;
				if(!Results){
					let Suggestion = new Settings.Schemas.Join({
						ServerID: message.guild.id,
						Roles: [],
						Channel: "",
						JMessage: "",
						LMessage: Message,
						
					})
					Suggestion.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					Results.LMessage = Message;
					Results.save().catch(Error => console.log(Error))
				}
			})
			
		
			let RichEmbed = new Discord.RichEmbed()
				.setTitle("Leave Message Setup Complete!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("LEAVE MESSAGE", `${Message}`)
				.setTimestamp();
			return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = LeaveCommand