const Commando = Depends.Commando
const Discord = Depends.Discord
const Paste = new Depends.Pastee()

class QueueCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'queue',
			aliases: ['q'],
            group: 'music',
            memberName: "queue",
            description: 'Will show the user whats playing in the voice channel, and whats coming up.'
        });
    }

    async run(message, args) {
        const Args = message.content.split(" ")
        if (message.author.equals(Settings.Bot.user)) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        var Queue = Records[message.guild.id].Music;
	    if (!Queue) return message.channel.send(':x: There is nothing playing.');
	    let Count = 0	
		
		let List = `${Queue.Queue.map(song => `${++Count}. ${song.title}`).join('\n')}`
		let ListCount = List.length
	
		if (ListCount >= 2048) {
			Paste.paste(List, function(Error, Results) {
				if (Error) return message.channel.send(":x: Couldn't retrieve Queue Link because of characters exceeding 2048 characters.")
				let Embed = new Discord.RichEmbed()
				.setColor("#27037e")
				.setTitle(":musical_note: Song Queue :musical_note:")
				.setDescription(`${Results.link}`);
				return message.channel.send("Current Songs Playing Now on Lyaboo", Embed)
			})
		} else {
			let Embed = new Discord.RichEmbed()
			.setColor("#27037e")
			.setTitle(":musical_note: Song Queue :musical_note:")
			.setDescription(`${List}`);
			return message.channel.send("Current Songs Playing Now on Lyaboo", Embed)	
		}	
    }
}

module.exports = QueueCommand
