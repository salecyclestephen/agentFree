const mongoose 					= require('mongoose'),
	  passportLocalMongoose 	= require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

// adds all the important functionality/methods from passport-local-mongoose into the user schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);