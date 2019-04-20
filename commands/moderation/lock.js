const Commando = Depends.Commando
const Discord = Depends.Discord
const Mongoose = Depends.Mongoose
const MS = Depends.MS

class LockCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'lock',
			aliases: ['lockdown', 'prison', 'notypus'],
            group: 'moderation',
            memberName: "lock",
            description: 'Will Lock a Channel or Server for [TIME].'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;
		
		
		if (!message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.channel.send(`Sorry, you don't have permission to lockdown or unlock!`)
			.then(msg => msg.delete(10000));
		}
			
		if (!Records[message.guild.id].Lockdown) Records[message.guild.id].Lockdown = { };
		
		let Time = Args[1];
		if (!Time) return message.channel.send('You must set a duration for the lockdown in either hour(s), minute(s) or second(s), or end it!');
		
		let Unlocks = ['release', 'unlock', 'free'];
		if (Unlocks.includes(Time)) {
			message.channel.overwritePermissions(message.guild.id, {
				SEND_MESSAGES: null
			}).then(() => {
				message.channel.send('Lockdown has now been lifted. Users may return to normal chatting.');
				clearTimeout(Records[message.guild.id].Lockdown[message.channel.id]);
				delete Records[message.guild.id].Lockdown[message.channel.id];
			}).catch(error => {
				console.log(error);
			});
		} else {
			message.channel.overwritePermissions(message.guild.id, {
				SEND_MESSAGES: false
			}).then(() => {
				message.channel.send(`Channel locked down for ${MS(MS(Time), { long:true })}`).then(() => {
					Records[message.guild.id].Lockdown[message.channel.id] = setTimeout(() => {
						message.channel.overwritePermissions(message.guild.id, {
							SEND_MESSAGES: null
						}).then(message.channel.send('Lockdown has now been lifted. Users may return to normal chatting.')).catch(console.error);
						delete Records[message.channel.id].Lockdown[message.channel.id];
					}, MS(Time));
				}).catch(error => {
					console.log(error);
				});
			});
		}
    }
}

module.exports = LockCommand
