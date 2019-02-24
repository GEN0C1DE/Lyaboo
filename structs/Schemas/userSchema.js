const Mongoose = Depends.Mongoose

let UserSchema = new Mongoose.Schema({
	UserId: String,
	IsAFK: Boolean,
	Reason: String
});

module.exports = Mongoose.model("Users", UserSchema)