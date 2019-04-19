module.exports = (Bot, Member) => { 
	console.log(`${Member.user.username} has joined ${Member.guild.id}`);
	
	Settings.Schemas.Join.findOne({
		ServerID: Member.guild.id
	}, (Error, Results) => {
		if (Error) return console.error(Error);
		if(!Results) return;
		
		if (Results.Roles){
			Results.Roles.forEach((Role) =>{
				let ARole = Member.guild.roles.get(Role)
				if(ARole){
					Member.addRole(ARole);
				};
			})
		}
		
		let WelcomeChannel = Member.guild.channels.get(`${Results.Channel}`)
		if (WelcomeChannel) {
			if (!Results.JMessage === false){
				let WelcomeMention = `${Member.user}`
				let WelcomeEmbed = new Depends.Discord.RichEmbed()
				.setTitle("Member has joined!")
				.setThumbnail(Member.user.displayAvatarURL)
				.setDescription(`${Results.JMessage}`)
				.setColor("#27037e")
				.setFooter(`You are the ${Member.guild.memberCount} member to joined.`)
				.setTimestamp();
				WelcomeChannel.send(WelcomeMention, WelcomeEmbed)
			}
		}
	})

	Settings.Schemas.Level.findOne({
		UserId: Member.id
	}, (Error, Results) => {
		if (!Results) return;
		if (!Error) console.error(Error);
		
		let CurrentLevel = Results.LevelNumber;
			
		Settings.Schemas.Role.findOne({
			ServerID: Member.guild.id
		}, (Error, Results) => {
			if(Error) console.error(Error);
			if (!Results) return;
			
			let Roles = Results.Roles
			Roles.forEach((array) => {
				let LvlNum = array[0]
				let RoleID = array[1]
				let ARole = Member.guild.roles.get(RoleID)
						
				if(!ARole) return;
				if(!LvlNum) return;
						
				if(Number(LvlNum) <= CurrentLevel){
					Member.addRole(ARole);
				}	
			})
		})	
	})
}
