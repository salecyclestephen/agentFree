const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
	houseNumber: String,
	streetName: String,
	postCode: String,
	image: String,
	askingPrice: String,
	dateAdded: String,
	modifiedDate: String
});

module.exports = mongoose.model('House', HouseSchema);