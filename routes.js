'use strict';
/**
*   Main application routes
**/

module.exports = (app) => {
  app.use('/api/wallet', require('./api/wallet'));
};
