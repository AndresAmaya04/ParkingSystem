const express = require('express');
const sequelize = require('./utils/db');
const path = require('path');
const cors = require('cors'); // Importa el paquete cors
require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'dev.env')
});

const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilita CORS para todas las solicitudes
app.use(cors(
	{
		origin : '*',
	}
));

app.use('/cars', require('./routes/car_routes'));

app.get('/', (req, res) => {
    res.send('Hello World!')
});

(async () => {
	try {

		await sequelize.sync(
			{ force: false} //Reset db every time
		);
		console.log('Listening on PORT: ' + port);
		app.listen(port); //DEF in docker.compose.yml
	} catch (error) {
		console.log(error);
	}
})();
