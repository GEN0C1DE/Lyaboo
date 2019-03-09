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
		
		const member = message.mentions.members.first()

		if (!member.user.bot) {
			message.channel.startTyping();
			const RichEmbed = new Discord.RichEmbed()
			.setThumbnail(member.user.avatarURL)
			.setDescription(`Info on **${member.user.tag}** (ID: ${member.user.id})`)
			.setColor('0x0000FF')
			.setTitle(member.user.tag)
			.addField('**Guild-based Info:**', `Nickname: ${member.nickname ? member.nickname : 'No nickname'}\nRoles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\nJoined at: ${member.joinedAt}`)
			.addField('**User Info:**', `Created at: ${(member.user.createdAt)}\n${(member.user.bot ? 'Account Type: Bot' : 'Account Type: User')}\nStatus: ${(member.user.presence.status)}`)
			.setFooter(`Powered by Lyaboo`);
			message.channel.send(RichEmbed);
			message.channel.stopTyping();
		} else {
			message.channel.startTyping();
			request.get(`https://discordbots.org/api/bots/${member.user.id}`, (Error, Results, Body) => {
				if (Error) return console.error;
				let Information = JSON.parse(Body);
				
				const Embed = new RichEmbed()
				.setThumbnail(member.user.avatarURL)
				.setDescription(`Info on **${member.user.tag}** (ID: \`${user.id}\`)`)
				.setColor('0x0000FF')
				.setTitle(user.tag)
				.addField('**Guild-based Info:**', `Nickname: ${member.nickname ? member.nickname : 'No nickname'}\nRoles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\nJoined at: ${member.joinedAt}`)
				.addField('**User Info:**', `Created at: ${member.user.createdAt}\n${member.user.bot ? 'Account Type: Bot' : 'Account Type: User'}\nStatus: ${member.user.presence.status}\nGame: ${member.user.presence.game ? member.user.presence.game.name : 'None'}`)
				.addField('**Bot Info:**', `Servers: ${Information.server_count ? `${Information.server_count}` : 'Could not get server count'} \nUpvotes: ${Information.points ? `${Information.points}` : 'Could not get bot stats'} \nDescription: ${Information.shortdesc ? `${Information.shortdesc}` : 'Could not get bot info'}`)
				.setFooter('Powered by Lyaboo and discordbots.org');
				message.channel.send(Embed);
			});	
			message.channel.stopTyping();
		}
    }
}
		
module.exports = UserInfoCommand