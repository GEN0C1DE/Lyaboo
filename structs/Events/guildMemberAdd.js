module.exports = (Bot, Member) => { 
	console.log(`${Member.user.username} has joined ${Member.guild.id}`);

    const Role = Member.guild.roles.find(r => r.name === "Noobs");
    Member.addRole(Role)

    const welcomeChannel = Member.guild.channels.find('name', 'general'); 

    if (Member.guild.id === "521782616563646465"){
	    if (welcomeChannel) {
		let WelcomeMessage = `${Member.user}`
		let WelcomeEmbed = new Depends.Discord.RichEmbed()
		.setTitle("Member has joined!")
		.setThumbnail(Member.user.displayAvatarURL)
		.setDescription(`Welcome ${Member.user} to ${Member.guild.name}. Please remember to read <#521863469482377217> and to be active to achieve roles. We are a community of people who simply try to have fun. If you have any questions, please see an Moderator or a Person of Higher Role in the Server. To make a suggestion, please see <#522104070647971840> and note that its a Beta feature in progress.`)
      		.setColor("#27037e")       
		.setFooter(`You are the ${Member.guild.memberCount} member to joined.`)
		.setTimestamp();
		welcomeChannel.send(WelcomeMessage, WelcomeEmbed)
	    }
	
    }
}
