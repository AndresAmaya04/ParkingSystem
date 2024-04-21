const io = require("socket.io-client");

// Conexión al servidor de socket
const socket = io("http://localhost:3000"); // Asegúrate de cambiar la URL si el servidor de socket está en un puerto diferente

// Manejar eventos de conexión
socket.on("connect", () => {
    console.log("Conexión establecida con el servidor de socket");
});

// Manejar eventos para recibir datos de los endpoints
socket.on("carsData", (data) => {
    console.log("Datos recibidos:", data);
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor de socket");
});
