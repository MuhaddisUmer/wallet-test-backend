'use strict';

// ==================== //
// Development Settings //
// ==================== //

module.exports = {
  mongo: {
    db_url: process['env']['DB_URL'],
    
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    debug: false,
  },
};
