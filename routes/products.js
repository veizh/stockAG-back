var express = require('express');
const products= require('../controllers/products');
var router = express.Router();
const auth = require('../middleware/auth');
/* products listing. */
//ajouter auth sur getOne ref =>employe / update => admin/updateqtonly => employe/ deleteone=>admin
router.get('/getOne/:ref', auth,products.getOne);
router.get('/getAll', products.getAll);
router.post('/create',auth, products.create);
router.put('/updateOne/:ref',auth, products.updateOne);
router.put('/updateImage/:ref',auth, products.updateImage);
router.put('/updateQuantityAndAlert/:ref',auth, products.updateQuantityAndAlert)
router.put('/addProductAndHandleAlert/:ref', products.addProductAndHandleAlert)
router.put('/removeProductAndHandleAlert/:ref',auth, products.removeProductAndHandleAlert)
router.delete('/deleteOne/:ref',auth, products.deleteOne);

// authorize route to roll

module.exports = router;
