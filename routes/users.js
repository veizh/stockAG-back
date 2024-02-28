var express = require('express');
const users= require('../controllers/users');
var router = express.Router();

/* products listing. */
router.post("/create",users.create)
router.post('/login',users.login)
router.post('/auth',users.verifyJWT)
// authorize route to roll

module.exports = router;
