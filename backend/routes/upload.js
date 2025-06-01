const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadImage } = require('../controllers/uploadController');

router.use(auth);
router.post('/', uploadImage);

module.exports = router;