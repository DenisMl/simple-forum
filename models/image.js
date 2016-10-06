var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	url: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	comments: [{
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		text: String,
		date: Date
	}],
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	date: Date,
	tags: String,
	title: String,
}, { versionKey: false });

module.exports = mongoose.model('Image', imageSchema);
