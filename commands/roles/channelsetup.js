const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class ChannelCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'setchannel',
			aliases: ['channelsetup'],
			group: 'roles',
			memberName: "setchannel",
			description: 'Setting the Channel for Leave and Join Message.'
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
			
			let Channel = message.guild.channels.find(Args[1])
			if (!Channel) return;
			
			Settings.Schemas.Join.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) return;
				if(!Results){
					let NewChannel = new Settings.Schemas.Join({
						ServerID: message.guild.id,
						Roles: [],
						Channel: Args[1],
						JMessage: "",
						LMessage: ""
						
					})
					NewChannel.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					Results.Channel = Args[1];
					Results.save().catch(Error => console.log(Error))
				}
			})
			
		
			let RichEmbed = new Discord.RichEmbed()
				.setTitle("Channel Setup Complete!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("CHANNEL", `${Args[1]}`)
				.setTimestamp();
			return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = ChannelCommand