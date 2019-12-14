const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());


app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, './public', 'index.html'));
});

module.exports = app;
