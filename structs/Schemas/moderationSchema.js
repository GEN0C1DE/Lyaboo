const Mongoose = Depends.Mongoose

let ModSchema = new Mongoose.Schema({
	ServerId: String,
	Logging: Boolean,
	LogsChannel: String
});

module.exports = Mongoose.model("Moderation", ModSchema)