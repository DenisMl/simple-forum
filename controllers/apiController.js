var User = require('../models/user');
var Image = require('../models/image');
var fs = require('fs');
var apiController = {};

apiController.addPicture = function (req, res) {
	var newImage = new Image();
	newImage.url = req.body.url;
	newImage.author = req.user;
  console.log(newImage)
	newImage.save(function(err){
		if (err) return console.error(err);
    res.send({});
	});
};

apiController.loadPictures = function (req, res) {
  Image.find({}).exec(function(err, images) {
    res.send(images);
  });
};

apiController.openPicture = function (req, res) {
	const id = req.query.id;
	Image.findOne({ _id: id }).populate('author').exec(function(err, image) {
    res.send(image);
  });
};

module.exports = apiController;
