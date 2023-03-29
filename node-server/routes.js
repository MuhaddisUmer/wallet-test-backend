'use strict';
/**
*   Main application routes
**/

module.exports = (app) => {
  app.use('/api', require('./api/wallet'));
};
