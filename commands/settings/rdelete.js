const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RDeleteCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'rdelete',
			aliases: ['leveldelete'],
			group: 'settings',
			memberName: "rdelete",
			description: 'Deletes Roles within the Database for the Level System.'
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
						
			if (!message.mentions.roles.first() === Args[1]) return message.channel.send(":x: Invalid Role!")
			let RoleArg = message.mentions.roles.first() 
			let RoleId =  RoleArg.id
			
			let LevelArg = Args[2]
			if (!Number(LevelArg)) return message.channel.send(":x: You must provide a numerical value!").then(R => R.delete(5000));
						
			Settings.Schemas.Role.findOne({
				ServerID: message.guild.id
			}, (Error, Results) => {
				if (Error) console.log(Error)
				if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(5000));
				
				let Count = 0
				let Successful = false;
				let Sorting = Results.Roles.map(ROLE => {
					if (ROLE[0] == LevelArg){
						if (ROLE[1] == RoleId) {
							Results.Roles.splice(Count, 1)
							Successful = true
						}	
					}
					Count = Count + 1
				})
				Results.save().catch(Error => console.log(Error))
				
				if (Successful === true) {
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Role Deletion Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("ROLE DELETED FROM DATABASE", `${Args[1]}`)
					.setTimestamp();
					return message.channel.send(RichEmbed);
				}
			})
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RDeleteCommand