const express = require("express");
const router = express.Router();
const itemcontroler=require("../controllers/itemController")
router.post('/users/:userId/products', itemcontroler.addItemToUser);
router.get('/users/:userId/products',itemcontroler.getProducts)
router.delete('/users/:userId/products/:productId', itemcontroler.deleteProduct);
router.put('/users/:userId/products/:productId', itemcontroler.updateKitchenItem);

module.exports = router;