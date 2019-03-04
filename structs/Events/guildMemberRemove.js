module.exports = (Bot, Member) => { 
	console.log(`${Member.user.username} has left ${Member.guild.id}`);
    
	const leaveChannel = Member.guild.channels.find('name', 'general'); 
	if (Member.guild.id === "521782616563646465"){
		if (leaveChannel) {
			let LeaveEmbed = new Depends.Discord.RichEmbed()
            .setTitle("Member has left!")
            .setThumbnail(Member.user.displayAvatarURL)
            .setDescription(`Sad to see you leave ${Member.user}! We hope you enjoyed your stay at ${Member.guild.name}.`)
            .setColor("6e00ff")
            .setFooter(`Member Count is at ${Member.guild.memberCount}.`)
            .setTimestamp();
        leaveChannel.send(LeaveEmbed)
		}
    }
}
