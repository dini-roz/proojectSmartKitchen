// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// router.post("/", userController.createUser);
// router.get("/:userName", userController.getUser);
// router.post('/:userId/shopping-list', userController.addShoppingListItem);
// router.get('/:userId/shopping-list', userController.getShoppingList);
// router.delete('/:userId/shopping-list/:itemId',userController.deleteShoppingListItem );
// router.post('/:userId/purchased-items', userController.addPurchasedItem);
// router.put('/users/:userId/kitchen-items/:productName', userController.updateKitchenItemQuantity);
// module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // ייבוא של הקונטרולר

router.post("/", userController.createUser);
router.get("/:userName", userController.getUser);
router.post('/:userId/shopping-list', userController.addShoppingListItem);
router.get('/:userId/shopping-list', userController.getShoppingList);
router.delete('/:userId/shopping-list/:itemId',userController.deleteShoppingListItem );
// --- THIS IS LIKELY LINE 10 ---
router.put('/users/:userId/kitchen-items/:productName', userController.updateKitchenItemQuantity);
// --- END LIKELY LINE 10 ---
module.exports = router;