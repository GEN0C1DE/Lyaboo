const Commando = Depends.Commando
const Discord = Depends.Discord

class UserInfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user', 'uinfo', 'whois'],
			group: 'support',
			memberName: 'user-info',
			description: 'Gets information about a user.'
		});
	}
	async run(message, args){
        	if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (!message.author.bot) {
			message.channel.startTyping();
			const member = message.mentions.members.first()
			const RichEmbed = new Discord.RichEmbed()
			.setThumbnail(message.author.avatarURL)
			.setDescription(`Info on **${message.author.tag}** (ID: ${message.author.id})`)
			.setColor('0x0000FF')
			.setTitle(message.author.user.tag)
			.addField('**Guild-based Info:**', `Nickname: ${member.nickname ? member.nickname : 'No nickname'}\nRoles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\nJoined at: ${member.joinedAt}`)
			.addField('**User Info:**', `Created at: ${(message.author.createdAt)}\n${(message.author.bot ? 'Account Type: Bot' : 'Account Type: User')}\nStatus: ${(message.author.presence.status)}`)
			.setFooter(`Powered by Lyaboo`);
			message.channel.send(RichEmbed);
			message.channel.stopTyping();
		} 
    });
}
		
module.exports = UserInfoCommand
