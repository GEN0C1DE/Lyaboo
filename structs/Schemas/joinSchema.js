const Mongoose = Depends.Mongoose

let JoinSchema = new Mongoose.Schema({
	ServerID: String,
	Roles: Array,
	Channel: String,
	JMessage: String,
	LMessage: String
});

module.exports = Mongoose.model("Join", JoinSchema)