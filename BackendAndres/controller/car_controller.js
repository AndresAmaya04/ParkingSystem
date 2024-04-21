const carsService = require('../services/car_service');

const getTime = async (req, res) => {
    try {
        const time = carsService.tiemposRespuesta;
        return res.status(200).json({ time });
    } catch (error) {
        console.error('Error al medir el tiempo de respuesta:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllCars = async (req, res) => {
    console.log(' getAllCars: [GET] /cars/');
    try {
        const allCars = await carsService.getAllCars();
        if (allCars.error) {
			return res.status(400).json({ ' Bad Request': allCars.error });
		}
        return res.status(200).json({allCars});
    } catch (error) {
        return res.status(400).json({ error: 'Bad Request' + error });
    }
};

const createCar = async (req, res) => {
    console.log(' getAllCars: [GET] /cars/');
    try {        
        const car = await carsService.createCar(req.body)
        if (car.error) {
			return res.status(400).json({ ' Bad Request': car.error });
		}
    } catch (error) {
        return res.status(400).json({ error: 'Bad Request' + error });
    }
};

const deleteCar = async (req, res)=> {
    console.log(' deleteCar: [Delete] /cars/');
    console.log('BODY PERRO ADNRES --> ' + JSON.stringify(req.params.placa));
    try {        
        const car = await carsService.deleteCar(req.params.placa)
        if (car.error) {
			return res.status(400).json({ ' Bad Request': car.error });
		}
    } catch (error) {
        return res.status(400).json({ error: 'Bad Request' + error });
    }
};

module.exports={
    getAllCars,
    createCar,
    deleteCar,
    getTime
}