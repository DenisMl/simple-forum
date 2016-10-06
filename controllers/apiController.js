var User = require('../models/user');
var Image = require('../models/image');
var fs = require('fs');
var apiController = {};

apiController.addPicture = function (req, res) {
	var newImage = new Image();
	newImage.url = req.body.url;
	newImage.author = req.user;
	newImage.title = req.body.title;
	newImage.date = new Date();
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

apiController.deleteAllPictures = function (req, res) {
  Image.find({}).remove().exec();
	res.send({});
};

apiController.openPicture = function (req, res) {
	const id = req.query.id;
	Image.findOne({ _id: id }).populate('author comments.author likes').exec(function(err, image) {
    res.send(image);
  });
};

apiController.getUserInfo = function (req, res) {
	res.send({ id: req.user._id, nick: req.user.nick });
};

apiController.addComment = function (req, res) {
	const comment = req.body.comment;
	const id = req.body.id;
	Image.findOne({ _id: id }).populate('comments.author').exec(function(err, image) {
		image.comments.push({
			author: req.user,
			text: comment,
			date: new Date(),
		});
		image.save(function(err) {
			if (err) return console.error(err);
	    res.send({ comments: image.comments });
		});
  });
};

apiController.addLike = function (req, res) {
	Image.findOne({ _id: req.body.imageId }).populate('likes').exec(function(err, image) {
		const index = image.likes.findIndex(item => String(item._id) === String(req.user._id));
		if (index === -1) {
			image.likes.push(req.user);
		} else {
			image.likes.splice(index, 1);
		}
		image.save(function(err) {
			if (err) return console.error(err);
	    res.send({ likes: image.likes });
		});
  });
};

module.exports = apiController;
