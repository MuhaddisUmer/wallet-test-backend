'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let WalletSchema = new Schema({
    name: { type: String },
    currency: { type: String },
    balance: { type: Number, default: 0 },
    todayBalanceChange: { type: Number, default: 0 }

});



module.exports = { Wallet: mongoose.model('Wallet', WalletSchema) };