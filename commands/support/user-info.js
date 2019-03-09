const Commando = Depends.Commando
const Discord = Depends.Discord

class UserInfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user', 'uinfo', 'whois'],
			group: 'support',
			memberName: 'user-info',
			description: 'Returns information about a user.'
		});
	}
	async run(message, args){
        if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (Settings.Testing === true) return;
		
		if (!message.author.bot) {
			message.channel.startTyping();
			const RichEmbed = new Discord.RichEmbed()
			.setThumbnail(user.avatarURL)
			.setDescription(`Info on **${user.tag}** (ID: ${user.id})`)
			.setColor('0x0000FF')
			.setTitle(user.tag)
			.addField('**Guild-based Info:**', `Nickname: ${member.nickname ? member.nickname : 'No nickname'}\nRoles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\nJoined at: ${member.joinedAt}`)
			.addField('**User Info:**', `Created at: ${user.createdAt}\n${user.bot ? 'Account Type: Bot' : 'Account Type: User'}\nStatus: ${user.presence.status}\nGame: ${user.presence.game ? user.presence.game.name : 'None'}`)
			.setFooter(`Powered by ${this.client.user.username}`);
			message.channel.send(RichEmbed);
			message.channel.stopTyping();
		} 
    });
}
		
module.exports = UserInfoCommand
