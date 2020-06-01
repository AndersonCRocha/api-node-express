const express = require('express');
const bodyParser = require('body-parser')

const userRoute = require('./src/routes/userRoutes')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))

userRoute(app);

app.get('/', (request, response) => {
    response.send('Base path API with express')
});

app.listen(port, () => {
    console.log(`Running API in port: ${port}`)
});
