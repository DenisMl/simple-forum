var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/image', apiController.addPicture);

router.get('/image', apiController.openPicture);

router.delete('/imageList', apiController.deleteAllPictures);

router.get('/imageList', apiController.loadPictures);

router.get('/user', apiController.getUserInfo);

router.post('/comment', apiController.addComment);

router.post('/likes', apiController.addLike);


module.exports = router;
