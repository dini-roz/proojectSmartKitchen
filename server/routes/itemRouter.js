const express = require("express");
const router = express.Router();
const itemcontroler=require("../controllers/itemController")
router.post('/users/:userId/products', itemcontroler.addItemToUser);
module.exports = router;