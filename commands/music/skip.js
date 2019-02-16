const Commando = Depends.Commando
const Discord = Depends.Discord


class SkipCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'skip',
			aliases: ['s'],
            group: 'music',
            memberName: "skip",
            description: 'Will Skip a youtube link playing in a Voice Channel.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;
		        
		var Args = message.content.split(" ")
		var Queue = Records[message.guild.id].Music;
		
		if (!message.member.voiceChannel) return message.channel.send(':x: You are not in a voice channel!').then(M => M.delete(5000));
		if (!Queue) return message.channel.send(':x: There is nothing playing that I could skip for you.').then(M => M.delete(5000));
			
		if (message.member.hasPermission('ADMINISTRATOR')) {
			Queue.Connection.dispatcher.end('Skip command has been used!');
			return undefined;
		} else {
			let Song = Queue.Queue[0]
			let Required = Math.ceil(message.member.voiceChannel.members.size/2)
			if (Song.requester.id === message.member.id) {
				Queue.Connection.dispatcher.end('Skip command has been used!');
				return undefined;
			} else {
				if Queue.Queue[0].skips.includes(message.member.id) return message.channel.send(":warning: You've already voted to skip this song!")
				Queue.Queue[0].skips.push(message.member.id)
				message.channel.send(":white_check_mark: Vote Submitted!").then(M => M.delete(5000))
				
				if (Queue.Queue[0].skips.length >= Required) {
					message.channel.send(":white_check_mark: Song Skipped").then(M => M.delete(5000))
					Queue.Connection.dispatcher.end('Skip command has been used!');
				}
				return undefined;
			}
		}
    }
}

module.exports = SkipCommand