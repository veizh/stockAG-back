var express = require('express');
const users= require('../controllers/users');
const auth = require('../middleware/auth');
var router = express.Router();

/* products listing. */
router.post("/create",users.create)
router.post('/login',users.login)
router.put('/modifyOneUser',auth,users.modifyOneUser)
router.get('/getAllUsers',auth,users.getAllUsers)
router.post('/auth',users.verifyJWT)
router.post('/mail',users.sendMail)
router.delete('/deleteOne/:_id',auth,users.deleteOne)
// authorize route to roll

module.exports = router;
