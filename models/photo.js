const mongoose = require('mongoose');

// Photo Schema
const photoSchema = mongoose.Schema({
	photoID:{
		type: String,
		required: true
	},
	userID:{
		type: String,
		required: true
	},
	imgBase64:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

const Photo = module.exports = mongoose.model('Photo', photoSchema);

// Get Photo
module.exports.getPhoto = (callback, limit) => {
	Photo.find(callback).limit(limit);
}
module.exports.addPhoto = (photo, callback) => {
	Photo.create(photo, callback);
}
// Get Photo by ID
module.exports.getPhotoById = (id, callback) => {
	Photo.findById(id, callback);
}
// Delete Photo
module.exports.removePhoto = (id, callback) => {
	var query = {_id: id};
	Photo.remove(query, callback);
}
