const Mongoose = Depends.Mongoose

let WarnSchema = new Mongoose.Schema({
	ServerID: String,
	UserID: String,
	Warns: Array
});

module.exports = Mongoose.model("Warnings", WarnSchema)