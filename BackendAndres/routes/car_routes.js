const controller = require('../controller/car_controller');
const express = require('express');
const router = express.Router();


router.get('/', controller.getAllCars);
router.post('/', controller.createCar);
router.delete('/:placa', controller.deleteCar);
router.get('/time',controller.getTime);

module.exports = router;