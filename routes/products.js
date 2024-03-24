var express = require('express');
const products= require('../controllers/products');
var router = express.Router();
const auth = require('../middleware/auth');
/* products listing. */
//ajouter auth sur getOne ref =>employe / update => admin/updateqtonly => employe/ deleteone=>admin
router.get('/getOne/:ref', auth,products.getOne);
router.get('/getAll',auth, products.getAll);
router.post('/create',auth, products.create);
router.put('/updateOne/:ref',auth, products.updateOne);
router.put('/updateQuantityAndAlert/:ref',auth, products.updateQuantityAndAlert)
router.delete('/deleteOne/:ref',auth, products.deleteOne);

// authorize route to roll

module.exports = router;
