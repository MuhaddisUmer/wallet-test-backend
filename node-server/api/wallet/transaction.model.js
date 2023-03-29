'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let TransactionSchema = new Schema({
    from:  { type: Schema.Types.ObjectId, ref: 'Wallet' },
    to: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    amount: { type: Number},
    txTime: { type: Date, default: Date.now },


});



module.exports = { Transaction: mongoose.model('Transaction', TransactionSchema) };