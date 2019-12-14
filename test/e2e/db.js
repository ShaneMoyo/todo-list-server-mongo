const connect = require('../../lib/connect');
const mongoose = require('mongoose');

before(()=> connect(process.env.MONGODB_URI));
after(()=> mongoose.connection.close());
