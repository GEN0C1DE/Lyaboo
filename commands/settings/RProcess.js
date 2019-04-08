const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class AddCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'rprocess',
			aliases: ['rprocess'],
			group: 'settings',
			memberName: "rprocess",
			description: 'Setup Process for Join Message, Leave Message, Adding, Removing, Setting Channel, and Viewing Roles for people.\n**Options:[add, remove, view, setchannel, joinmessage, leavemessage]**',
			examples: ['=rprocess add @Role', '=rprocess remove @Role', '=rprocess view', '=rprocess setchannel CHANNELID', '=rprocess joinmessage This is a test message!', '=rprocess leavemessage This is a test message!']
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
			
			if (Args[1] == "add"){
				if (!message.mentions.roles.first() === Args[2]) return message.channel.send(":x: Invalid Role Provided!").then(M => M.delete(2000));
				let RoleArg = message.mentions.roles.first() 
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
							LMessage: ""
						
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
				.addField("ROLES ADDED", `${RoleArg}`)
				.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
			} 
			if (Args[1] == "remove"){
				if (!message.mentions.roles.first() === Args[2]) return message.channel.send(":x: Invalid Role Provided!").then(M => M.delete(5000));
				let RoleArg = message.mentions.roles.first() 
				let RoleId = RoleArg.id

				Settings.Schemas.Join.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) return;
					if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(5000));
					
					let Successful = false;
					for(var i = 0; i < Results.Roles.length; i++){ 
					   if ( Results.Roles[i] === RoleId) {
						 Results.Roles.splice(i, 1); 
						 Successful = true
					   }
					}
					Results.save().catch(Error => console.log(Error))

					if (Successful === true) {
						let RichEmbed = new Discord.RichEmbed()
						.setTitle("Removed Roles for receiving on Joining!")
						.setThumbnail(message.member.user.displayAvatarURL)
						.setColor("#27037e")
						.setFooter(`Brought to you by Lyaboo.`)
						.addField("ROLE REMOVED", `${RoleArg}`)
						.setTimestamp();
						return message.channel.send(RichEmbed);	
					}	
				})
			}
			if (Args[1] == "view"){
				Settings.Schemas.Join.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) return;
					if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(1000));
					
					let Roles = Results.Roles
					let Sending = `${Roles.map(ROLESID => `${message.guild.roles.get(ROLESID)}`).join('\n')}`
					if (Roles.length === 0) Sending = "No Roles Available!";
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Viewing Roles for receiving on Joining!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("ROLES ADDED", `${Sending}`)
					.setTimestamp();
					return message.channel.send(RichEmbed);	
				})
			}
			if (Args[1] == "setchannel"){
				let Channel = message.guild.channels.get(Args[2]);
				if (!Channel) return;
			
				Settings.Schemas.Join.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) return;
					if(!Results){
						let NewChannel = new Settings.Schemas.Join({
							ServerID: message.guild.id,
							Roles: [],
							Channel: Args[2],
							JMessage: "",
							LMessage: ""
							
						})
						NewChannel.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
					} else {
						Results.Channel = Args[2];
						Results.save().catch(Error => console.log(Error))
					}
				})
			
		
				let RichEmbed = new Discord.RichEmbed()
					.setTitle("Channel Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("CHANNEL", `${Args[2]}`)
					.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
			}
			if (Args[1] == "joinmessage"){
				let Message;
				if (Args[2] === "false") {
					Message = false
				} else {
					Message = Args.splice(2).join(" ")
				}

				Settings.Schemas.Join.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) return;
					if(!Results){
						let NewJoin = new Settings.Schemas.Join({
							ServerID: message.guild.id,
							Roles: [],
							Channel: "",
							JMessage: Message,
							LMessage: "",
							
						})
						NewJoin.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
					} else {
						Results.JMessage = Message;
						Results.save().catch(Error => console.log(Error))
					}
				})
				
			
				let RichEmbed = new Discord.RichEmbed()
					.setTitle("Join Message Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("JOIN MESSAGE", `${Message}`)
					.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
			}
			if (Args[1] == "leavemessage"){
				let Message;
				if (Args[2] === "false") {
					Message = false
				} else {
					Message = Args.splice(2).join(" ")
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
			}
			return message.channel.send(`:warning: Couldn't Find ${Args[1]} as a Setting!`)
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = AddCommand