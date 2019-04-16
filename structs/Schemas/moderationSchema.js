const Mongoose = Depends.Mongoose

let ModSchema = new Mongoose.Schema({
	ServerID: String,
	Logging: Boolean,
	LogsChannel: String
});

module.exports = Mongoose.model("Moderation", ModSchema)