const express = require('express');

let app = express();
let port = 5000

require('./routes')(app);

let server = require('http').createServer(app);
server.listen(port, () => console.log(`listening to ${port}`));
