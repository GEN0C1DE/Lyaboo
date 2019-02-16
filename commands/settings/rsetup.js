const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'rsetup',
			group: 'settings',
			memberName: "rsetup",
			description: 'Setup for the Roles per Level will begin.'
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
			
			let LevelArg = Args[1]
			
			let RoleArg = message.mentions.roles.first()
			if (!RoleArg) return message.channel.send(":x: Invalid Role!");
			let RoleId =  RoleArg.id
			
			Settings.Schemas.Role.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) console.log(Error);
				if(!Results){
					let Role = new Settings.Schemas.Role({
						ServerID: message.guild.id,
						Roles: [[LevelArg, RoleId]]
					})
					Role.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					let SetFRoles = [LevelArg, RoleId]
					Results.Roles.push(SetFRoles)
					Results.save().catch(Error => console.log(Error))
				}
			})
			
		
			let RichEmbed = new Discord.RichEmbed()
				.setTitle("Role Setup Complete!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("LEVEL TO ACHIEVE", `${Args[1]}`)
				.addField("ROLE WHEN ACHIEVED", `${Args[2]}`)
				.setTimestamp();
			return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RSetupCommand