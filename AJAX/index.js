const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const staticPath = path.normalize(__dirname + '/public'); // static - /public folder
app.use(express.static(staticPath));

// avaliable in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes/api/routes')(app); //start func which called user router obj

const server = app.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});