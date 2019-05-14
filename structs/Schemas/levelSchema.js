const Mongoose = Depends.Mongoose

let LevelSchema = new Mongoose.Schema({
	ServerID: String,
	UserId: String,
	LevelNumber: Number,
	XPNumber: Number,
	MoneyNumber: Number
})

module.exports = Mongoose.model("Level", LevelSchema)