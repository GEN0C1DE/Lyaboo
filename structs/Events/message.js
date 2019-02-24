module.exports = (Bot, Message) => { 
	if (Message.author.bot) return;
	if (Message.channel.type === "dm") return;
	if (Message.content.startsWith(Settings.Prefix)) return;
	if (Settings.Testing === true) return;
	
	Depends.Mongoose.connect(Settings.Connection + "\Level", {useNewUrlParser: true }).catch(Error => console.error(Error))
	
	Settings.Schemas.User.findOne({
			UserId: Message.author.id
		}, (Error, Results) => {
				if (Error) console.log(Error);
				if(!Results) return;
				if (Results.IsAFK === true){
					Results.IsAFK = false
					Results.Reason = ""
					Results.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
					let RichEmbed = new Depends.Discord.RichEmbed()
					.setColor("#27037e")
					.setDescription(`Welcome Back!, Your AFK was removed.`)
					.setTimestamp();
					Message.channel.send(`${Message.author}`, RichEmbed).then(M => M.delete(5000));
				}
			})
			
	if (Message.content.includes(Message.mentions.members.first())){
		let MentionedUser = Message.mentions.members.first()
		Settings.Schemas.User.findOne({
			UserId: MentionedUser.id
		}, (Error, Results) => {
				if (Error) console.log(Error);
				if(!Results) return;
				if (Results.IsAFK === true){
					let RichEmbed = new Depends.Discord.RichEmbed()
					.setColor("#27037e")
					.setDescription(`The User ${MentionedUser} is currently AFK: ${Results.Reason}`)
					.setTimestamp();
					Message.channel.send(`${Message.author}`, RichEmbed).then(M => M.delete(5000));
				}
			})
	}
	
	Settings.Schemas.Level.findOne({
		UserId: Message.author.id
	}, (Error, Results) => {
		let NewXP = Math.floor(Math.random() * 7) + 8;
		if (!Results) {
			let Level = new Settings.Schemas.Level({
				UserId: Message.author.id,
				LevelNumber: 1,
				XPNumber: NewXP,
				MoneyNumber: 0
			})
			Level.save().then(Results => console.log(Results)).catch(Error => console.log(Error))
		} else {
			let CurrentLevel = Results.LevelNumber;
			let CurrentXP = Results.XPNumber;
			let NextLevel = Results.LevelNumber * 300;
					
			Results.XPNumber = CurrentXP + NewXP;

			if(NextLevel <= Results.XPNumber){
				Results.LevelNumber = Results.LevelNumber + 1;
				let NewLevel = Results.LevelNumber
				let Embed = new Depends.Discord.RichEmbed()
				.setColor("6e00ff")
				.setTitle("Congratulations!")
				.setDescription(`You have leveled up to Level ${NewLevel}`);
				Message.channel.send(`${Message.author}`, Embed).then(MSG => MSG.delete(10000))
				
				Settings.Schemas.Role.findOne({
					ServerID: Message.guild.id
				}, (Error, Results) => {
					if(Error) console.error(Error);
					if (!Results) return;
					let Roles = Results.Roles
					Roles.forEach((array) => {
						let LvlNum = array[0]
						let RoleID = array[1]
						let ARole = Message.guild.roles.get(RoleID)
						
						if(!ARole) return;
						if(!LvlNum) return;
						
						if(Number(LvlNum) <= NewLevel){
							Message.member.addRole(ARole);
						}	
					})
				})
			}
			Results.save().catch(Error => console.log(Error))
		}
	})
	
	Settings.Schemas.Suggestion.findOne({
		ServerID: Message.guild.id
	}, (Error, Results) => {
		if (Error) console.log(Error);
			if(!Results) return Message.channel.send(":warning: Database Entry not Found for this Server!")
				
			let SChannel = Results.SuggestionsChannel
			let RChannel = Results.RecordChannel
			
			if (Number(Message.channel.id) === Number(SChannel)){
				Message.delete(100)
				if(!Results.SuggestionsEnabled === true) return Message.channel.send({embed: {description: "This Server isn't Currently accepting Suggestions.", color: "6e00ff"}}).then(MS => MS.delete(5000))

				let FirstEmbed = new Depends.Discord.RichEmbed()
				.setColor("6e00ff")
				.setTimestamp()
				.addField("Beta Feature", "Thank you for testing this Feature! Your data has been recorded, and staff will review soon! These messages will disappear in a few seconds.");
				
				let SecondEmbed = new Depends.Discord.RichEmbed()
				.setColor("6e00ff")
				.setTimestamp()
				.setFooter(`Posted by ${Message.author.username} | #${Message.author.discriminator}`, Message.author.displayAvatarURL)
				.setAuthor(`Feedback #${Message.member.user.id}`, Message.guild.iconURL)
				.addField('Description', `${Message.content}`);        
									
				
				let ActualChannel = Bot.channels.get(RChannel)
				if (ActualChannel){ 
					ActualChannel.send(SecondEmbed); 
				} else { 
					return Message.channel.send(":x: Cannot Log Suggestions due to Error!")
				}

				Message.channel.send(FirstEmbed).then(Message => Message.delete(5000));
				
			} 	
	})
}