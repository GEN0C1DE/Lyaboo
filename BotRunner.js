// Coded by Christopher H::Lyawoo#9768

// Getting Bot Dependencies
global.Depends = {
	FS: require('readdir'), // File System
	// Primary Dependencies
    Discord: require('discord.js'), // Library for Hosting Bot.
    Commando: require('discord.js-commando'), // Library Extension for Hosting Bot.
    Timeout: require('foreach-timeout'), // Used for Rainbow Roles.
	Pastee: require("pastee"), // Used for Maintaining Data exceed overing Character Limits.
	Mongoose: require("mongoose"), // Used for Storing Data.
	Request: require("request"), // Used for Requesting Site Data.
	MS: require("ms"), // Used for Moderation and ETC.
	
    // Youtube and Music Dependencies
    YTDL: require('ytdl-core'), // To Host Music for Youtube.
    Search: require('yt-search'), // To Search in Various of Numbers on Youtube.
    Info: require('youtube-info'), // To get Info about a Youtube Song.
    Playlist: require('youtube-playlist') // To get a playlist of Songs from Youtube.
}

// Getting Bot Settings Information
global.Settings = { 
    Name: "Lyaboo", // Name of Bot.
    Version: "0.1.721", // Version of the Bot.
    Testing: false, // Testing State of the Bot.
    Prefix: "=", // Prefix of the Bot.
    Status: "", // Status of the Bot.
    DevServer: {
        GuildId: "521782616563646465", // Guild Number for Home Bot Discord.
        AnnouncementChannel: "521841249963999232", // Announcements Channel for Discord.
		StaffAnnouncementChannel: "524265252695703562", // Staff Announcements Channel for Discord.
        Developer: "417835827700301836" // Bot Developer for Lyaboo.
    },
    DevKeys: {
        Login: process.env.BOT_TOKEN // Used for Accessing the Bot.
    },
	Schemas: {
		Level: require(__dirname + "/structs/Schemas/levelSchema.js"),
		Suggestion: require(__dirname + "/structs/Schemas/suggestionSchema.js"),
		Role: require(__dirname + "/structs/Schemas/roleSchema.js"),
		User: require(__dirname + "/structs/Schemas/userSchema.js"),
		Join: require(__dirname + "/structs/Schemas/joinSchema.js"),
		Mods: require(__dirname + "/structs/Schemas/moderationSchema.js"),
		Warns: require(__dirname + "/structs/Schemas/warnSchema.js")
	},
    Bot: "", // Client 
	Connection: `mongodb://${process.env.MonUSERTOKEN}:${process.env.MonPASSTOKEN}@ds024748.mlab.com:24748/lyaboo_server` // Used for the Database
}
global.Records = { // Used for Storing Temporary Information.

}

// Getting Bot Registry
Settings.Bot = new Depends.Commando.Client({ commandPrefix: Settings.Prefix, unknownCommandResponse: false })
Settings.Status = `${Settings.Prefix}info | discord.me/Zulinghu ${Settings.Version}`

Settings.Bot.registry
    .registerGroup('support', 'Support Commands')
	.registerGroup('roles', 'Role Commands')
	.registerGroup('settings', 'Level Commands')
	.registerGroup('music', 'Vibes Commands')
	.registerGroup('economy', "Economy Commands")
    .registerGroup('utilities', 'Developer Commands')
	.registerGroup('misc', 'Other Commands')
	.registerGroup('moderation', 'Moderation Commands')
	.registerDefaults()
    .registerCommandsIn(__dirname + "/commands");

// Binding Connections
var Files = Depends.FS.readSync('structs/Events')
Files.forEach((File) => {
	try {
		if (File.split('.').slice(-1)[0] !== "js") return;
		let EventName = File.split('.')[0]
		console.log(EventName)
		
		let Event = require(__dirname + `/structs/Events/${File}`)
		Settings.Bot.on(EventName, Event.bind(null, Settings.Bot))
		delete require.cache[require.resolve(__dirname + `/structs/Events/${File}`)];
	} catch(Error) {
		console.error(Error)
	}	
}) 

// Opening Connections
Depends.Mongoose.connect(Settings.Connection, {useNewUrlParser: true }).catch(Error => console.error(Error))

// Getting Bot Functions
Settings.Bot.login(Settings.DevKeys.Login)