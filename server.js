
const app = require('./lib/app');
const connect = require('./lib/connect');

connect(process.env.MONGODB_URI);
const port = process.env.PORT || 3001;

app.listen(port, () => console.log('Server started, port: ', port));
