const router = require('express').Router();
const controller = require('./wallet.controller');

router.post('/create', controller.create);
router.get('/get-accounts', controller.getAccounts);
router.get('/get-account-balance/:account', controller.getAccountBalance);

/****************** 4 Endpoints ***************/
// ## Endpoint #1:
router.post('/', controller.wallet);


//  ### Endpoint #2:
router.get('/:id',controller.getWallet);

// ### Endpoint #3:
router.get('/', controller.wallets);


// ### Endpoint #4
router.post('/tx',controller.createTransaction);

module.exports = router;
