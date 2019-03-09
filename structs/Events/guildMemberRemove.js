module.exports = (Bot, Member) => { 
	console.log(`${Member.user.username} has left ${Member.guild.id}`);
    
	Settings.Schemas.Join.findOne({
		ServerID: Member.guild.id
	}, (Error, Results) => {
		if (Error) return console.error(Error);
		if(!Results) return;
		
		let LeaveChannel = Member.guild.channels.get(`${Results.Channel}`)
		if (LeaveChannel) {
			if (!Results.LMessage === false){
				let LeaveEmbed = new Depends.Discord.RichEmbed()
				.setTitle("Member has left!")
				.setThumbnail(Member.user.displayAvatarURL)
				.setDescription(`${Results.LMessage}`)
				.setColor("#27037e")
				.setFooter(`The member count stands at ${Member.guild.memberCount}.`)
				.setTimestamp();
				LeaveChannel.send(LeaveEmbed)
			}
		}	
	})
}