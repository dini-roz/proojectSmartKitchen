const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodlController'); // וודא שהנתיב נכון לקובץ הבקר שלך


router.post('/users/:userId/foods', foodController.addFoodToUser);


router.get('/users/:userId/foods', foodController.getAllFoodForUser);


router.delete('/users/:userId/foods/:foodId', foodController.deleteFoodFromUser);


router.put('/users/:userId/foods/:foodId', foodController.updateFoodForUser);

module.exports = router;