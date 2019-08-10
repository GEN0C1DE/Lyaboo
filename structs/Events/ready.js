module.exports = (Bot, Member) => { 
	console.log(`${Settings.Name} has loaded and is ready for Usage. Online at ${Settings.Bot.guilds.size}`);
    if (Settings.Testing === false) {
        Settings.Bot.user.setActivity(`${Settings.Status}`, {url: "http://twitch.tv/DUAPClan", type: "STREAMING"})
    };
    if(Settings.Testing === true){
        Settings.Bot.user.setStatus("idle");
        Settings.Bot.user.setActivity("Maintenance Mode On, Will Be Back Soon.")
        return;
    }
	
    Settings.Bot.guilds.forEach((guild) => {
		if (!Records[guild.id]) {
			Records[guild.id] = {
				
			}	
		}	
	});
}
