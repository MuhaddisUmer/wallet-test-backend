const router = require('express').Router();
const controller = require('./wallet.controller');

router.post('/create', controller.create);
router.get('/get-accounts', controller.getAccounts);
router.get('/get-account-balance/:account', controller.getAccountBalance);


module.exports = router;
