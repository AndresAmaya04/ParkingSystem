/*
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define los endpoints
const endpoints = [
    "http://localhost:4001/cars/time",
    "http://localhost:4002/cars/time",
    "http://localhost:4003/cars/time"
];

// Función para obtener datos de los endpoints y emitirlos a través del socket
const fetchDataAndEmit = async (socket) => {
    try {
        const promises = endpoints.map(endpoint => axios.get(endpoint));
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);

        socket.emit("carsData", data);
    } catch (error) {
        console.error("Error al obtener datos de los endpoints:", error);
    }
};

// Manejar conexiones de sockets
let interval;

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Si no hay intervalo creado, crea uno y ejecuta fetchDataAndEmit cada 15 segundos
    if (!interval) {
        interval = setInterval(() => {
            fetchDataAndEmit(io);
        }, 25000);
    }

    // Enviar datos inicialmente al cliente
    fetchDataAndEmit(socket);

    // Manejar desconexiones de sockets
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
        clearInterval(interval);
        interval = null; // Restablecer el intervalo cuando no hay clientes conectados
    });
});

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
    console.log(`Servidor de socket escuchando en el puerto ${PORT}`);
});
*/
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define los endpoints
const endpoints = [
    "http://localhost:4001/cars/time",
    "http://localhost:4002/cars/time",
    "http://localhost:4003/cars/time"
];

// Función para obtener datos de los endpoints y emitirlos a través del socket
const fetchDataAndEmit = async (socket) => {
    try {
        const promises = endpoints.map(async (endpoint, index) => {
            try {
                const startTime = Date.now(); // Registrar el tiempo de inicio

                const response = await axios.get(endpoint);
                const data = response.data;

                const endTime = Date.now(); // Obtener el tiempo de finalización de la solicitud
                const responseTime = endTime - startTime; // Calcular el tiempo de respuesta

                console.log(`Datos recibidos del endpoint ${index + 1}:`, data);
                console.log(`Tiempo de respuesta del endpoint ${index + 1}: ${responseTime} ms`);

                return { data, responseTime };
            } catch (error) {
                console.error(`Error al obtener datos del endpoint ${index + 1}:`, error);
                return null; // Retornar null para indicar que la solicitud falló
            }
        });
        
        const responses = await Promise.all(promises);

        // Filtrar las respuestas exitosas
        const successfulResponses = responses.filter(response => response !== null);

        // Emitir solo los datos de las respuestas exitosas
        socket.emit("carsData", successfulResponses.map(response => response.data));

        // Verificar si algún contenedor falló
        const failingContainers = endpoints.filter((_, index) => responses[index] === null);
        if (failingContainers.length > 0) {
            console.log("Contenedores fallidos:", failingContainers);
            restartContainers(failingContainers);
        }
    } catch (error) {
        console.error("Error al obtener datos de los endpoints:", error);
    }
};

function restartContainers(containers) {
    console.log('Restaurando Andoooo');
    try {
        // Iterar sobre cada URL en el array de contenedores
        containers.forEach(containerUrl => {
            // Dividir la dirección URL por "/"
            const parts = containerUrl.split("/");
            // Obtener el último segmento de la URL
            const lastSegment = parts[parts.length - 3];
            // Obtener los dos últimos caracteres del último segmento (suponiendo que sean los números del puerto)
            const portNumbers = lastSegment.slice(-2);
            // Obtener el nombre del contenedor
            let containerName = `back${portNumbers}`;
            // Si los dos últimos números son 01, añadir "-1" al final del nombre del contenedor
            if (portNumbers === "01") {
                containerName += "-1";
            }
            console.log("Reiniciando contenedor:", containerName);
            exec(`${'despliegue.bat'} ${containerName} `, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error al ejecutar el archivo .bat: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            });
        });
    } catch (error) {
        console.error("Error al reiniciar contenedores:", error);
        return null;
    }
}

// Manejar conexiones de sockets
let interval;

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Si no hay intervalo creado, crea uno y ejecuta fetchDataAndEmit cada 15 segundos
    if (!interval) {
        interval = setInterval(() => {
            fetchDataAndEmit(io);
        }, 25000);
    }

    // Enviar datos inicialmente al cliente
    fetchDataAndEmit(socket);

    // Manejar desconexiones de sockets
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
        clearInterval(interval);
        interval = null; // Restablecer el intervalo cuando no hay clientes conectados
    });
});

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
    console.log(`Servidor de socket escuchando en el puerto ${PORT}`);
});
