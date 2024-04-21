const express = require('express');
const cors = require('cors');
const http = require('http');
const { log } = require('console');
const os = require('os');


const app = express();

// Lista de servidores de backend
const backends = [
    'http://10.4.72.122:4000',
    'http://10.4.72.122:4010',
    'http://10.4.72.122:4012'
];

// Configurar middleware de CORS
app.use(cors(
	{
		origin : '*',
	}
));

async function pingBackend(backendURL) {
    try {
        const response = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            console.log(`[${new Date().toISOString()}] Respuesta correcta desde el back ${backendURL}`);
            return true;
        } else {
            console.error(`Error from ${backendURL}: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error: sin respuesta del back ${backendURL}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 4000)); 
        return false;
    }
}

let lastRespondedBackendIndex = -1; 

app.get('/ip', async (req, res) => {
    try {
        let nextBackendIndex = (lastRespondedBackendIndex + 1) % backends.length;
        let foundAvailableBackend = false;
        for (let i = 0; i < backends.length; i++) {
            const currentBackend = backends[nextBackendIndex];
            const isAvailable = await pingBackend(currentBackend);

            if (isAvailable) {
                res.status(200).json({ nextBackend: currentBackend });
                lastRespondedBackendIndex = nextBackendIndex;
                foundAvailableBackend = true;
                break;
            }       
            console.log(`[${new Date().toISOString()}] Time out - pasando al siguiente back`);
            nextBackendIndex = (nextBackendIndex + 1) % backends.length;
        }
        if (!foundAvailableBackend) {
            console.log("No hay servidores disponibles");
            res.status(503).json({ error: 'No backends available' });
        }
    } catch (error) {
        console.error('Error handling /ip request:', error);
        res.status(500).json({ error: 'Internal server error' }); 
    }
});


app.get('/listCars', async (req, res) => {
    try {
        const response = await fetch("http://10.4.72.122:4949/ip");
        if (response.ok) {
            const data = await response.json();
            const nextBackend = data.nextBackend;

            const carsResponse = await fetch(`${nextBackend}/cars`);
            if (carsResponse.ok) {
                const carsData = await carsResponse.json();
                res.status(200).json(carsData); 
            } else {
                res.status(500).json({ error: 'Error al listar carros en el backend' });
            }
        } else {
            res.status(500).json({ error: 'Error al obtener el próximo backend' });
        }
    } catch (error) {
        console.error('Error handling /listCars request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/deleteCar/:placa', async (req, res) => {
    try {
        const placa = req.params.placa;
        
        // Obtener la URL del próximo backend a través del endpoint /ip
        const ipResponse = await fetch("http:/10.4.72.122:4949/ip");
        if (!ipResponse.ok) {
            throw new Error('Error al obtener la IP del backend');
        }
        const data = await ipResponse.json();
        const nextBackend = data.nextBackend;

        res.status(200).json({ nextBackend, placa });
    } catch (error) {
        console.error('Error al borrar carro:', error);
        res.status(500).json({ error: 'Error al borrar carro' });
    }
});


// Define un nuevo endpoint para la creación de un nuevo carro
app.post('/addCar', async (req, res) => {
    try {
        // Obtén los datos del nuevo carro desde el cuerpo de la solicitud
        const { placa, color, image, fecha_entrafa } = req.body;

        // Obtiene la URL del próximo backend utilizando el endpoint /ip
        const ipResponse = await fetch("http://10.4.72.122:4949/ip");
        if (!ipResponse.ok) {
            throw new Error('Error al obtener la IP del próximo backend');
        }
        const ipData = await ipResponse.json();
        const nextBackend = ipData.nextBackend;

        // Realiza una solicitud POST al nuevo endpoint en el middleware para agregar el carro
        const addCarResponse = await fetch(`${nextBackend}/addCar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                placa: placa,
                color: color,
                image: image,
                fecha_entrafa: fecha_entrafa
            })
        });

        // Verifica si la solicitud de agregar el carro fue exitosa
        if (addCarResponse.ok) {
            // Enviar una respuesta al cliente indicando que el carro fue agregado correctamente
            res.status(201).json({ message: 'Carro agregado correctamente' });
        } else {
            // Si hubo un error al agregar el carro en el middleware, devuelve un error al cliente
            throw new Error('Error al agregar el carro en el middleware');
        }
    } catch (error) {
        console.error('Error al agregar el carro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Iniciar el servidor en el puerto 4949
const PORT = 4949;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Servidor de balanceo de carga iniciado en el puerto ${PORT}`);
    });
