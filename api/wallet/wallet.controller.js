
const { web3 } = require('../../config/web3');

const Wallet = require('./wallet.model');
const Transaction = require('./transaction.model');
const { dailyBalanceChange } = require('./wallet.helper');
const { currencies } = require('../../config/environment');
const { sendResponse, errReturned } = require('../../config/dto');
const { SUCCESS, BADREQUEST } = require('../../config/ResponseCodes');

/**
 * Create Wallet - Endpoint #1
**/
exports.wallet = async (req, res) => {
    try {
        let data = req['body'];
        let { name, currency, initalBalance } = req['body'];
        let required = ['name', 'currency', 'initalBalance'];

        for (let key of required)
            if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null)
                return sendResponse(res, BADREQUEST, `Please enter ${key}`, []);
        if (!currencies.includes(currency)) return sendResponse(res, BADREQUEST, "Invalid currency");
        if (await Wallet.findOne({ name })) return sendResponse(res, BADREQUEST, "wallet already added");

        /* Create new wallet using web3 */
        // let account = web3.eth.accounts.create(web3.utils.randomHex(32));
        // let wallet = web3.eth.accounts.wallet.add(account);
        // let password = web3.utils.randomHex(32)
        // let keystore = wallet.encrypt(password);

        // Save Wallet into Mongoose
        let newWallet = new Wallet({ name, currency, balance: initalBalance });
        await newWallet.save();

        return sendResponse(res, SUCCESS, "Wallet created successfully", newWallet);
    } catch (error) { errReturned(res, error) }
}
/**
 * Get Wallet - Endpoint #2
**/
exports.getWallet = async (req, res) => {
    try {
        let { id } = req['params'];
        if (!id || id == null || id == undefined)
            return sendResponse(res, BADREQUEST, "please send an id")

        let wallet = await Wallet.findById(id).lean();
        if (!wallet) return errReturned(res, "Invalid wallet request");

        wallet['todayBalanceChange'] = await dailyBalanceChange(wallet);

        return sendResponse(res, SUCCESS, "Wallet Details", wallet);
    } catch (error) { errReturned(res, error) }
}
/**
 * Get All Walletes - Endpoint #3
**/
exports.getWallets = async (req, res) => {
    try {
        let wallets = await Wallet.find({}).sort({ createdAt: - 1 }).lean();
        if (wallets.length < 0) return sendResponse(res, BADREQUEST, "No wallets created");

        // TODO: Need to see if we have any transactions for today if no then 0% change
        for (let wallet of wallets)
            wallet['todayBalanceChange'] = await dailyBalanceChange(wallet);

        return sendResponse(res, SUCCESS, "Wallets found", wallets);
    } catch (error) { errReturned(res, error) }
}
/**
 * Create transaction - Endpoint #4
**/
exports.createTransaction = async (req, res) => {
    try {
        const data = req['body']
        const { from, to, amount, currency } = data;
        const required = ['from', 'to', 'amount', 'currency']

        for (let key of required)
            if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null)
                return sendResponse(res, BADREQUEST, `Please enter ${key}`, []);

        if (from == to) return errReturned(res, 'Both wallets cannot be same');
        if (!currencies.includes(currency)) return sendResponse(res, BADREQUEST, "Invalid currency")

        let fromWallet = await Wallet.findById(from);
        if (!fromWallet) return sendResponse(res, BADREQUEST, "from wallet not found");
        if (!(await Wallet.findById(to))) return sendResponse(res, BADREQUEST, "to wallet not found");

        if (fromWallet['balance'] < amount) return sendResponse(res, BADREQUEST, "transaction failed, insufficient balance");

        // Create a new transaction
        let newTransaction = new Transaction({ from, to, amount, currency });

        // Update user table for the balance change
        let response = await Promise.all([
            Wallet.updateOne({ _id: to }, { $inc: { balance: amount } }),
            Wallet.updateOne({ _id: from }, { $inc: { balance: -amount } }),
            newTransaction.save()
        ]);

        let errors = [];
        if (!response[0]['nModified']) errors.push('To wallet balance is not updated');
        if (!response[1]['nModified']) errors.push('From walelt balance is not updated');
        if (!response[2]) errors.push('Unable to create new transaction');
        if (errors.length > 0) return sendResponse(res, BADREQUEST, 'Transation Failed', errors)

        return sendResponse(res, SUCCESS, "transaction successfull", newTransaction)
    } catch (error) { errReturned(res, error) }
}