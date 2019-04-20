const Commando = Depends.Commando
const Discord = Depends.Discord

const { Util } = require('discord.js')

const YTDL = Depends.YTDL
const Search = Depends.Search
const Info = Depends.Info
const Playlist = Depends.Playlist

async function HandleVideo(Video, Message, VoiceChannel, Playlist = false) {
	const Queue = Records[Message.guild.id].Music;
	
	const Song = {
		thumbnail: Video.thumbnailUrl,
		id: Video.videoId,
		title: Util.escapeMarkdown(Video.title),
		url: `https://www.youtube.com/watch?v=${Video.videoId}`,
		requester: Message.author,
		skips: [],
		repeat: false
	};
	
	if (!Queue) {
		Records[Message.guild.id].Music = {
			Text: Message.channel,
			Voice: VoiceChannel,
			Connection: null,
			Queue: [],
			Volume: 5,
			Playing: true
		}	
		Records[Message.guild.id].Music.Queue.push(Song);

		try {
			var Connection = await VoiceChannel.join();
			Records[Message.guild.id].Music.Connection = Connection;
			Play(Message.guild, Records[Message.guild.id].Music.Queue[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			Records[Message.guild.id].Music.delete(Message.guild.id);
			return Message.channel.send(`:warning: I could not join the voice channel: ${error}`);
		}
	} else {
		let Embed = new Discord.RichEmbed()
		.setColor("#27037e")
		.setThumbnail(`${Song.thumbnail}`)
		.addField("Song Name", `${Song.title}`, true)
		.addField("Song Link", `${Song.url}`, true)
		.addField("Song Requester", `${Song.requester}`, true);
		
		Records[Message.guild.id].Music.Queue.push(Song);
		if (Playlist) return undefined;
			else return Message.channel.send(`:musical_note: A song has been added to the queue!`, Embed);
	}
	return undefined;
}
async function Play(Guild, Song) {
	const Queue = Records[Guild.id].Music;

	if (!Song) {
		Queue.Voice.leave(); 
		delete Records[Guild.id].Music;
		
		if(Settings.DevServer.GuildId == Guild.id){
			if (Settings.Testing === false) {
				Settings.Bot.user.setActivity(`${Settings.Status}`, {url: "http://twitch.tv/Zulinghu", type: "STREAMING"})
			};
		};	
		return;
	}
	
	const Dispatcher = Queue.Connection.playStream(YTDL(Song.url, { filter: "audio", highWaterMark: 1024 * 1024 * 10 }, { passes: 5 }), { bitrate: 192000 })
		.on('end', Reason => {
			if (Reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(Reason);
			if (Reason === "Stop command has been used!") Play(Guild, Queue.Queue[0]);
			if (Reason !== "Stop command has been used!"){
				if (Queue.Queue[0].repeat === true) {
					Play(Guild, Queue.Queue[0]);
				} else {
					Queue.Queue.shift();
					Play(Guild, Queue.Queue[0]);
				}
			}	
		})
		.on('error', Error => console.error(Error));
	Dispatcher.setVolumeLogarithmic(Queue.Volume / 5);
	Queue.Text.send(`:musical_note: Now playing: **${Song.title}** Requested by: **${Song.requester}**`).then(M => M.delete(5000));
	if(Settings.DevServer.GuildId == Guild.id){
		if (Settings.Testing === false) {
			Settings.Bot.user.setActivity(`=info | Zulinghu Music: ${Song.title}`, {url: `${Song.url}`, type: "PLAYING"})
		};
	};	
}


class PlayCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'play',
			aliases: ['p', "vibe"],
            group: 'music',
            memberName: "play",
            description: 'Will play a Search Term, Playlist, or Link that is of youtube origin in the voice channel.'
        });
    }

    async run(message, args) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (Settings.Testing === true) return;
		
		const Args = message.content.split(" ")
        const VoiceChannel = message.member.voiceChannel;
		if (!VoiceChannel) return message.channel.send(":warning: I'm sorry but you need to be in a voice channel to play music!").then(M => M.delete(5000));
		
		const permissions = VoiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send(':warning: I cannot connect to your voice channel, make sure I have the proper permissions!').then(M => M.delete(5000));
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send(':warning: I cannot speak in this voice channel, make sure I have the proper permissions!').then(M => M.delete(5000));
		}
		
		const SearchString = Args.slice(1).join(' ');
		const URL = Args[1] ? Args[1].replace(/<(.+)>/g, '$1') : '';

        if (URL.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            Playlist(URL, 'url').then(Results => {
                let Array = Results.data.playlist
                if (Array) {
                    Array.forEach((Song) => {
                        var ID = YTDL.getVideoID(Song)
                        Info(ID, function (Err, Results2) {
                            if (Err) throw new Error(Err);
                            HandleVideo(Results2, message, VoiceChannel, true)
                        })
                    })

                    let Embed = new Discord.RichEmbed()
                        .setColor("6e00ff")
                        .setDescription(`Youtube Playlist: ${URL}`)
                    return message.channel.send(`A Playlist has been added to the queue!`, Embed).then(M => M.delete(5000));
                }
            })
        } else if (YTDL.validateURL(URL)) {
                var ID = YTDL.getVideoID(URL)
                Info(ID, function (Err, Results) {
                    if (Err) throw new Error(Err);
                    return HandleVideo(Results, message, VoiceChannel)
                })
		} else {
			Search(SearchString, async function(Error, Results) {
				let Count = 0
				let Videos = Results.videos.slice(0, 10)
				
				Info(Videos[0].videoId, function(Err, Results){
					if (Err) throw new Error(Err);
					return HandleVideo(Results, message, VoiceChannel)
				});
			})
		}	
	}
}

module.exports = PlayCommand
