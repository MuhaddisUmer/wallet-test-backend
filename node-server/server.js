process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'development';
require('dotenv').config({ path: `./.env.${process['env']['NODE_ENV']}` });

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');

let app = express();
const config = require('./config/environment');

app.use(cors());
// app.use(upload());
app.use(morgan('dev'));
app.use(config.assets);
app.use(requestIp.mw());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);
require('./config/db-connection')();

app.get('*', (req, res) => res.sendFile(config.view));

let server = require('http').createServer(app);

server.listen(config['port'], () => console.log(`listening to ${config['port']}  ${process.env.NODE_ENV}`));

