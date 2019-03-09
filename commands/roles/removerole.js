const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class RemoveCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'removerole',
			aliases: ['roleremove'],
			group: 'roles',
			memberName: "removerole",
			description: 'Removes a Role for people joining.'
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
				ServerID: message.guild.id,
				Roles: [RoleId]
			}, (Error, Results) => {
				if (Error) return;
				if(!Results) return message.channel.send(`:x: Database Entry for this server has not been found!`)
				let Roles = Results.Roles
				
				for(var i = 0; i < Roles.length; i++){ 
				   if ( Roles[i] === RoleId) {
					 Roles.splice(i, 1); 
				   }
				}
				
				let RichEmbed = new Discord.RichEmbed()
				.setTitle("Removed Roles for receiving on Joining!")
				.setThumbnail(message.member.user.displayAvatarURL)
				.setColor("#27037e")
				.setFooter(`Brought to you by Lyaboo.`)
				.addField("ROLES ADDED", `<@${RoleId}>`)
				.setTimestamp();
				return message.channel.send(RichEmbed);	
			})
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = RemoveCommand