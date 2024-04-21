const Car = require('../models/Car')

let tiemposRespuesta = [24]; // Lista dinámica para almacenar múltiples tiempos de respuesta

const medirTiempoRespuesta = async (startTime) => {
    const endTime = new Date(); // Capturar el tiempo de finalización
    const elapsedTime = endTime - startTime; // Calcular el tiempo transcurrido
    tiemposRespuesta.push(elapsedTime); // Agregar el tiempo transcurrido a la lista dinámica
    console.log(`Tiempo de respuesta: ${elapsedTime}ms`);
    console.log(tiemposRespuesta);
    return elapsedTime; // Devolver el tiempo transcurrido
};

const createCar = async (car) => {
    console.log('createCar: ', car);
    console.log('car : ', car);
    const startTime = new Date(); // Capturar el tiempo de inicio
    try {
        const existingCar = await Car.findOne({ where: { placa: car.placa } });
        if (existingCar) {
            console.log('Carro con la misma placa ya existe');
			medirTiempoRespuesta(startTime);
			console.log(tiempoRespuesta);
            return { error: 'Carro con la misma placa ya existe' };
        }
    
        const CAR_MODEL = {
            placa: car.placa,
            color: car.color,
            image: car.image,
            fecha_entrafa: car.fecha_entrafa
        };
    
        try {
            const car = await Car.create(CAR_MODEL);
            console.log('Ok createCar: ', { car });
            medirTiempoRespuesta(startTime); // Medir el tiempo de respuesta
			console.log(tiempoRespuesta);
            return car;
        } catch (error) {
            console.log('Error in createCar: ', error);
            medirTiempoRespuesta(startTime); // Medir el tiempo de respuesta
			console.log(tiempoRespuesta);
            return { error: error };
        }
    } catch (error) {
        console.log('Error: ', error);
        medirTiempoRespuesta(startTime); // Medir el tiempo de respuesta
		console.log(tiempoRespuesta);
        return { error: 'Bad Request' };
    }
};


const getAllCars = async ()=> {
	const startTime = new Date(); // Capturar el tiempo de inicio
	try {
        const cars = await Car.findAll();
		medirTiempoRespuesta(startTime);
		console.log(tiemposRespuesta);
        return cars;
    } catch (error) {
		medirTiempoRespuesta(startTime);
		console.log(tiemposRespuesta);
        console.log('Error al traer carritos' + error)
    }
};

const deleteCar = async (placa) => {
	const startTime = new Date(); 
	console.log('delete Car: ', placa);
	try {
		const car = await Car.destroy({where: { placa: placa}});
		console.log('Ok deleteCar: ', {car});
		medirTiempoRespuesta(startTime);
		console.log(tiemposRespuesta);
		return car;
	} catch (error) {
		console.log('Error in createCar: ' + 'car: ', error);
		medirTiempoRespuesta(startTime);
		console.log(tiemposRespuesta);
		return {error: error};
	}
};



module.exports = {
    createCar,
    getAllCars,
	deleteCar,
	tiemposRespuesta
}