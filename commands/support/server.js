const Commando = Depends.Commando
const Discord = Depends.Discord

class ServerCommand extends Commando.Command { 
	constructor(client){
		super(client, {
			name: 'server',
			group: 'support',
			memberName: "server",
			description: 'Returns information about the Server.'
		});
	}	
	
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		let Online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
		let Day = message.guild.createdAt.getDate()
		let Month = 1 + message.guild.createdAt.getMonth()
		let Year = message.guild.createdAt.getFullYear()
		let Icon = message.guild.iconURL;
		
		let Embed = new Discord.RichEmbed()
		   .setAuthor(message.guild.name, Icon)
		   .setFooter(`Server Created • ${Day}.${Month}.${Year}`)
		   .setColor("#7289DA")
		   .setThumbnail(Icon)
		   .addField("ID", message.guild.id, true)
		   .addField("Name", message.guild.name, true)
		   .addField("Owner", message.guild.owner.user.tag, true)
		   .addField("Region", message.guild.region, true)
		   .addField("Channels", message.guild.channels.size, true)
		   .addField("Members", message.guild.memberCount, true)
		   .addField("Humans", message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
		   .addField("Bots", message.guild.members.filter(m => m.user.bot).size, true)
		   .addField("Online", Online.size, true)
		   .addField("Roles", message.guild.roles.size, true);
		   
		return message.channel.send(Embed)
 
	}
}

module.exports = ServerCommand
	
