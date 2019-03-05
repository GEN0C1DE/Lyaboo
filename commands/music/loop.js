const Commando = Depends.Commando
const Discord = Depends.Discord


class LoopCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'loop',
			aliases: ['repeat', 'r'],
            group: 'music',
            memberName: "loop",
            description: 'Will Repeat a youtube link playing in a Voice Channel.'
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
			let Song = Queue.Queue[0]
			if (Song.repeat === false) {
				Queue.Queue[0].repeat = true
				let RichEmbed = new Discord.RichEmbed()
				.setColor("#27037e")
				.setDescription("Song Loop Activated!")
				return message.channel.send(RichEmbed);
			} else {
				Queue.Queue[0].repeat = false
				let RichEmbed = new Discord.RichEmbed()
				.setColor("#27037e")
				.setDescription("Song Loop De-Activated!")
				return message.channel.send(RichEmbed);
			}	
			return undefined;
		} else {
			return message.channel.send(":x: Missing Permissions!");
		}
    }
}

module.exports = LoopCommand