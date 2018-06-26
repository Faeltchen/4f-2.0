var express = require('express')
  , router = express.Router()

router.use('/api/user', require('./user'));
router.use('/api/upload', require('./upload'));
router.use('/api/content', require('./content'));

module.exports = router;
