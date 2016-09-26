var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/image', apiController.addPicture);

router.get('/image', apiController.openPicture);

router.get('/imageList', apiController.loadPictures);


module.exports = router;
