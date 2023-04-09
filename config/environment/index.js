'use strict';

const _ = require('lodash');

const all = {
    port: 4000,
    currencies : ['ETH'],
    userRoles: ['user', 'admin'],
};

/* Export the config object based on the NODE_ENV*/
/*===============================================*/
module.exports = _.merge(all, require(`./${process['env']['NODE_ENV']}.js`) || {});