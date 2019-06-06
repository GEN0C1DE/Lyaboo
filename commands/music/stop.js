const Commando = Depends.Commando
const Discord = Depends.Discord


class StopCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'music',
            memberName: "stop",
            description: 'Will stop all music playing in the voice channel the Bot is in.'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        var Queue = Records[message.guild.id].Music;
       
	    if (!message.member.voiceChannel) return message.channel.send(':x: You are not in a voice channel!');
		if (!Queue) return message.channel.send(':warning: There is nothing playing that I could stop for you.');
		Queue.Queue = [];
		Queue.Connection.dispatcher.end('Stop command has been used!');
		return undefined;
    }
}

module.exports = StopCommand
