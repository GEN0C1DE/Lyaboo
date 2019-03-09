const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class AddCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'setrole',
			aliases: ['addrole'],
			group: 'roles',
			memberName: "setrole",
			description: 'Setting the Role for people joining.'
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
			
			let RoleArg = message.mentions.roles.first()
			if (!RoleArg) return message.channel.send(":x: Invalid Role!");
			let RoleId = RoleArg.id

			Settings.Schemas.Join.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) return;
				if(!Results){
					let NewRole = new Settings.Schemas.Join({
						ServerID: message.guild.id,
						Roles: [RoleId],
						Channel: "",
						JMessage: "",
						LMessage: "",
						
					})
					NewRole.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
				} else {
					Results.Roles.push(RoleId);
					Results.save().catch(Error => console.log(Error))
				}
			})
			
		
			let RichEmbed = new Discord.RichEmbed()
				.setTitle("Add Role for Joining Setup Complete!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("ROLES ADDED", `<@${RoleId}>`)
				.setTimestamp();
			return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = AddCommand