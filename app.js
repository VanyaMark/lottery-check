// Cargar todo el JSON y lo ponemos en una variable
const lottery = require('./data/lottery.json');
const intersectArrays = require('./utils/utils.js');

// Importar el paquete de terceros que acabamos de instalar. Fijaos que como se encuentra en la carpeta node_modules NO hace falta especificar ninguna ruta (al igual que pasa con los built-in modules)
const express = require('express');
const logger = require('morgan');

// Es generarme un objeto para gestionar el enrutamiento y otros aspectos de la aplicación
const app = express();

// Añadimos el middleware de morgan para loguear todas las peticiones que haga un cliente
app.use(logger('dev'));

// nos gustaría que también gestionaras los datos de tipo JSON (entre ellos los POST que nos lleguen)
app.use(express.urlencoded({ extended: true }));  // Middleware para parsear datos de formularios


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/api/check-date', (req, res) => {

    // 1. Tenemos que informar al endpoint de tipo GET de una fecha en concreto. usaremos una query string para proveer de esta info
    // ¿Que aspecto va a tener una consulta para el 17 de mayo de 2024?
    // /api/check-date?date=2024-05-17

    // 2. Capturar/extraer el valor del parámetro 'date' 
    const date = req.query.date;
    console.log("🚀 ~ file: app.js:31 ~ app.get ~ date:", date)

    // const {date} = req.query; 

    // 3. Buscar a ver si hay sorteo para la fecha 'date' en el lottery.json (cargar el JSON) require, readFileSync

    // Miramos si alguno de los sotrteos de lottery.json el campo "draw_date" de alguno de sus objetos incluye el substring de la fecha que estamos buscando 
    const item = lottery.find(raffle => raffle.draw_date.includes(date));
    console.log("🚀 ~ file: app.js:39 ~ app.get ~ item:", item)

    // 4. ¿Qué método de array vaís a usar para la busqueda? .find

    if (item) {

        /**
         * {
         *    "message" : "Draw found",
         *    "winningNumbers": "20 36 37 48 67 16 02"
         * }
         */
        res.send({
            message: "Draw found",
            winningNumbers: `${item.winning_numbers} ${item.supplemental_numbers} ${item.super_ball}`
        });
    } else {
        res.status(404).send({
            message: "Draw not found for the given date"
        });
    }

    // 5. Suponemos de momento que siempre nos pasan una fecha que existe. 2020-09-25 . Tenemos que devolver un JSON con este formato


});

// /api/get-computed-results?date=2024-06-18&playedNumbers=2 3 20 33 44 50 02
app.get('/api/get-computed-results', (req, res) => {
    //1 Obtener fecha y números de query string 
    const { date, playedNumbers } = req.query;
    console.log(date)
    console.log(playedNumbers)
    // 2 Buscar la fecha y si hay un numeros de loteria de ella
    const item = lottery.find(raffle => raffle.draw_date.includes(date));
    console.log("🚀 ~ file: app.js:39 ~ app.get ~ item:", item)
    // 3 Comparar los números jugados con los que han tocado y tener un contador para cada match
    if (item) {
       let winningNumbersArr = item.winning_numbers.split(' ');
        winningNumbersArr.push(item.supplemental_numbers);
        winningNumbersArr.push(item.super_ball);

        console.log('winningNumbersArr: ', winningNumbersArr)
        let usersNumbersArr = playedNumbers.split(' ');
        console.log('usersNumbersArr: ', usersNumbersArr)
    }
    // 4 Buscar en prizes.json el premio según el contador
   const matchingNumbers = intersectArrays(usersNumbersArr, winningNumbersArr)
   console.log('matchingNumbers: ', matchingNumbers)
    // 5 Hacer un res.send con el json con los campos matchNumbers y prize
});


// Levantar el servidor
app.listen(3005, () => {
    console.log("Servidor corriendo en el puerto 3005.");
});

