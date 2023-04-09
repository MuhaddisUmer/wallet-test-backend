process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'development';
require('dotenv').config({ path: `.env.${process['env']['NODE_ENV']}` });

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/environment');

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);
require('./config/db')();

let server = require('http').createServer(app);
server.listen(config['port'], () => console.log(`listening to ${config['port']}  ${process['env']['NODE_ENV']}`));