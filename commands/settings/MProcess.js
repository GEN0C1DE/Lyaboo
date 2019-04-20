const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose

class AddCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'mprocess',
			aliases: ['mprocess'],
			group: 'settings',
			memberName: "mprocess",
			description: 'Process for Viewing or Setting Up Moderation Settings. \n**Options:[view, set, warnsbeforekick, warnsbeforeban, muterole]**',
			examples: ['=mprocess view', '=mprocess set true CHANNELID']
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (message.member.hasPermission('ADMINISTRATOR')) {
			let Args = message.content.split(" ")
			Mongoose.connect(Settings.Connection + "\Moderation", {useNewUrlParser: true })
			.catch(Error => {
				console.error(Error)
			})
			
			if (Args[1] == "muterole"){
				let Role = message.mentions.roles.first() || message.guild.roles.get(Args[1]);
				if(!Role) return message.channel.send(":x: Roles weren't Found!");
				let Name = Role.name;
			
				Settings.Schemas.Mods.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results){
						let Mods = new Settings.Schemas.Mods({
							ServerID: message.guild.id,
							Logging: false,
							LogsChannel: "",
							MuteRole: Name,
							WarnsBeforeKick: NaN,
							WarnsBeforeBan: NaN
						})
						Mods.save().catch(Error => console.log(Error))
					} else {
						Results.MuteRole = Name;
						Results.save().catch(Error => console.log(Error))
					}
				})
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Moderation Mute Role Identification Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("Mute Role Identification", `${Name}`)
					.setTimestamp();
					
					return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
				}
			}
			if (Args[1] == "warnsbeforekick"){
				let Bool;
				if (Args[2] === "false") {
					Bool = false
				} else {
					Bool = Args[2]
				};
				
				if(Number(Bool)){
					Settings.Schemas.Mods.findOne({
						ServerID: message.guild.id
					}, (Error, Results) => {
						if (Error) console.log(Error);
						if(!Results){
							let Suggestion = new Settings.Schemas.Mods({
								ServerID: message.guild.id,
								Logging: false,
								LogsChannel: "",
								WarnsBeforeKick: Args[2],
								WarnsBeforeBan: NaN
							})
							Suggestion.save().catch(Error => console.log(Error))
						} else {
							Results.WarnsBeforeKick = Args[2];
							Results.save().catch(Error => console.log(Error))
						}
					})
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Moderation Warn Kick Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("Warns Before Kick", `${Args[2]}`)
					.setTimestamp();
					
					return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);
				}
			}
			if (Args[1] == "warnsbeforeban"){
				let Bool;
				if (Args[2] === "false") {
					Bool = false
				} else {
					Bool = Args[2]
				};
				
				if(Number(Bool)){
					Settings.Schemas.Mods.findOne({
						ServerID: message.guild.id
					}, (Error, Results) => {
						if (Error) console.log(Error);
						if(!Results){
							let Suggestion = new Settings.Schemas.Mods({
								ServerID: message.guild.id,
								Logging: false,
								LogsChannel: "",
								WarnsBeforeKick: NaN,
								WarnsBeforeBan: Args[2]
							})
							Suggestion.save().catch(Error => console.log(Error))
						} else {
							Results.WarnsBeforeBan = Args[2];
							Results.save().catch(Error => console.log(Error))
						}
					})
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Moderation Warn Ban Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("Warns Before Ban", `${Args[2]}`)
					.setTimestamp();
					
					return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);	
				}
			}
			if (Args[1] == "set"){
				let Bool;
				if (Args[2] === "true") {
					Bool = true
				} else {
					Bool = false
				};
				
				let SuggestionChannel = message.guild.channels.get(Args[3]);
				if (!SuggestionChannel) return message.channel.send(":x: Logging Channel Id Invalid!")

				Settings.Schemas.Mods.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results){
						let Suggestion = new Settings.Schemas.Mods({
							ServerID: message.guild.id,
							Logging: Bool,
							LogsChannel: Args[3],
							WarnsBeforeKick: NaN,
							WarnsBeforeBan: NaN
						})
						Suggestion.save().catch(Error => console.log(Error))
					} else {
						Results.Logging = Bool;
						Results.LogsChannel = Args[3];
						Results.save().catch(Error => console.log(Error))
					}
				})
				
			
				let RichEmbed = new Discord.RichEmbed()
					.setTitle("Moderation Channel Setup Complete!")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("ENABLED", `${Args[2]}`)
					.addField("LOG CHANNEL", `${Args[3]}`)
					.setTimestamp();
				return message.channel.send(":white_check_mark: Setup Successfully.", RichEmbed);	
			}
			if (Args[1] == "view"){
				Settings.Schemas.Mods.findOne({
					ServerID: message.guild.id
				}, (Error, Results) => {
					if (Error) console.log(Error);
					if(!Results) return message.channel.send(":x: No Results found for this Server!").then(R => R.delete(1000))
					
					
					let RichEmbed = new Discord.RichEmbed()
					.setTitle("Viewing the Moderation Settings for the Server.")
					.setThumbnail(message.member.user.displayAvatarURL)
					.setColor("#27037e")
					.setFooter(`Brought to you by Lyaboo.`)
					.addField("Server ID (Pre-Set)", `${Results.ServerID}`)
					.addField("Is Enabled?", `${Results.Logging}`)
					.addField("Record Channel", `${Results.LogsChannel}`)
					.addField("Warns Before Kick", `${Results.WarnsBeforeKick}`)
					.addField("Warns Before Ban", `${Results.WarnsBeforeBan}`)

					.setTimestamp();
					return message.channel.send(RichEmbed);	
				})
			}
		} else {
			message.channel.send(":x: Missing Permissions 'ADMINISTRATOR'")
			return;
		}
	}
}

module.exports = AddCommand
