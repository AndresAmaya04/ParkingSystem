# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 4005

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["node", "app.js"]