var express = require('express');
const products= require('../controllers/products');
var router = express.Router();
const auth = require('../middleware/auth');
/* products listing. */
//ajouter auth sur getOne ref =>employe / update => admin/updateqtonly => employe/ deleteone=>admin
router.get('/getOne/:_id', auth,products.getOne);
router.get('/getAll', products.getAll);
router.post('/create',auth, products.create);
router.put('/updateOne/:_id',auth, products.updateOne);
router.put('/returnFromInter/:_id', products.returnFromInter);
router.put('/updateImage/:_id',auth, products.updateImage);
router.put('/updateQuantityAndAlert/:_id',auth, products.updateQuantityAndAlert)
router.put('/addProductAndHandleAlert/:_id', products.addProductAndHandleAlert)
router.put('/removeProductAndHandleAlert/:_id',auth, products.removeProductAndHandleAlert)
router.delete('/deleteOne/:_id',auth, products.deleteOne);

// authorize route to roll

module.exports = router;
