'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WalletSchema = new Schema({
    name: { type: String, unique: true },
    balance: { type: Number, default: 0 },
    address: { type: String, lowercase: true },
    currency: { type: String, enum: ['ETH', 'BTC'], default: 'ETH' },

    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wallet', WalletSchema);