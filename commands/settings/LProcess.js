const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'lprocess',
			aliases: ['lprocess'],
			group: 'settings',
			memberName: "lprocess",
			description: 'Setup Process for Adding, Removing, and Viewing Roles for people to Earn.\n**Options:[add, remove, view]**',
			examples: ['=lprocess add 21 @Role', '=lprocess remove 21 @Role', '=lprocess view']
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
			
			if (Args[1] == "view"){
				Settings.Schemas.Role.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(1000))
					
					let Roles = Results.Roles
					let Sending = `${Roles.map(ROLESID => `Level: ${ROLESID[0]}, Role: ${message.guild.roles.get(ROLESID[1])};`).join('\n')}`
					if (Roles.length === 0) Sending = "No Roles Available!";
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Viewing the Roles for Users to Earn.")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.setDescription(`${Sending}`)
					.setTimestamp();
					return message.channel.send(RichEmbed);
					
				})
			}
			if (Args[1] == "add"){
				let LevelArg = Args[2]
				if (!Number(LevelArg)) return message.channel.send(":x: You must provide a numerical value!").then(R => R.delete(5000));
				
				if (!message.mentions.roles.first() === Args[3]) return message.channel.send(":x: Invalid Role!")
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
			}
			if (Args[1] == "remove"){
				let LevelArg = Args[2]
				if (!Number(LevelArg)) return message.channel.send(":x: You must provide a numerical value!").then(R => R.delete(5000));
				
				if (!message.mentions.roles.first() === Args[3]) return message.channel.send(":x: Invalid Role!")
				let RoleArg = message.mentions.roles.first() 
				let RoleId =  RoleArg.id
							
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
			}
			
			return message.channel.send(`:warning: Couldn't Find ${Args[1]} as a Setting!`)
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RSetupCommand