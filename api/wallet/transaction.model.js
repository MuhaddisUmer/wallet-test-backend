'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    amount: { type: Number },
    
    to: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    from: { type: Schema.Types.ObjectId, ref: 'Wallet' },

    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);