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
				.setFooter(`Member Count is now ${Member.guild.memberCount} members.`)
				.setTimestamp();
				WelcomeChannel.send(WelcomeMention, WelcomeEmbed)
			}
		}	
	})
}
