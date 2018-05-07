var express = require('express')
  , router = express.Router()

router.use('/api/user', require('./user'));

module.exports = router;
