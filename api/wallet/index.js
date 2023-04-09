const router = require('express').Router();
const controller = require('./wallet.controller');

// Create Wallet - Endpoint #1
router.post('/', controller.wallet);

// Get Wallet - Endpoint #2
router.get('/:id',controller.getWallet);

// Get All Walletes - Endpoint #3
router.get('/', controller.getWallets);

// Create transaction - Endpoint #4
router.post('/tx',controller.createTransaction);

module.exports = router;