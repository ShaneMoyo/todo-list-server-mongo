const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth')();

const auth = require('./routes/auth');
const users = require('./routes/users');
const todos = require('./routes/todos');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/users', ensureAuth, users);
app.use('/api/todos', ensureAuth, todos);

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, './public', 'index.html'));
});
app.use(errorHandler());

module.exports = app;
