const http = require('http');
const app = require('../../lib/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = http.createServer(app);
const request = chai.request(server).keepOpen();

after(() => server.close());

module.exports = request;
