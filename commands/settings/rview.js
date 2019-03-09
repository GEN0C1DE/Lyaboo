const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RSetupCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'rview',
			aliases: ['levelview'],
			group: 'settings',
			memberName: "rsetup",
			description: 'Views Roles that are in the Database for the Level System.'
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
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RSetupCommand