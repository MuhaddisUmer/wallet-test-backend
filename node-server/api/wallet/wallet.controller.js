const Web3API = require('web3');
const { sendResponse, errReturned } = require('../../config/dto');
const { SUCCESS, BADREQUEST, NOTFOUND } = require('../../config/ResponseCodes');
const { Wallet } = require('./wallet.model');
const { Transaction } = require('./transaction.model');
const { currencies } = require('../../config/environment/const')

const web3 = new Web3API(new Web3API.providers.HttpProvider('https://alpha-wider-log.matic-testnet.discover.quiknode.pro/09ef56f5570195f0cc225476db17b7e020799b77/'));

const wallet1privatekey = 'bf617b7bd814f29bac4e620175017f90a73f77a71a807a62e0a77f42b21eb03e'

/*
    * Create new wallet
*/
exports.create = async (req, res) => {

    try {

        let account = web3.eth.accounts.create(web3.utils.randomHex(32));
        let wallet = web3.eth.accounts.wallet.add(account);
        let keystore = wallet.encrypt(web3.utils.randomHex(32));


        let data = { account, wallet, keystore };

        return res.status(200).json({ success: true, message: "created", data });


    } catch (e) { return res.status(400).json({ success: false, message: "failed" }); }
};


/*
 * get accounts
*/
exports.getAccounts = async (req, res) => {

    try {

        let accounts = await web3.eth.getAccounts();

        return res.status(200).json({ success: true, message: "accounts found", accounts });


    } catch (e) { return res.status(400).json({ success: false, message: e.message }); }
};



/*
    * get account balance
*/
exports.getAccountBalance = async (req, res) => {

    try {

        let account = req.params.account
        if (!account) return res.status(400).json({ success: false, message: "provide an account" });

        let balance = await web3.eth.getBalance(account);

        return res.status(200).json({ success: true, balance });


    } catch (e) { return res.status(400).json({ success: false, message: e.message }); }
};

/*
 * Endpoint #1 
 */
exports.wallet = async (req, res) => {
    try {
        let required = ['name', 'currency'];
        let { name, currency, initalBalance } = req['body'];
        let data = req['body'];

        for (let key of required)
            if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null)
                return sendResponse(res, BADREQUEST, `Please enter ${key}`, []);

        if (!currencies.includes(currency)) return sendResponse(res, BADREQUEST, "Invalid currency")
        if (await Wallet.findOne({ name })) return sendResponse(res, BADREQUEST, "wallet already added")

        // Create new wallet using web3

        ///////////// Save Wallet into Mongoose ///////////////
        let wallet = new Wallet({
            name,
            currency,
            balance: initalBalance
        });
        await wallet.save();
        if (!wallet) return sendResponse(res, BADREQUEST, "something went wrong");

        return sendResponse(res, SUCCESS, "wallet added successfully", wallet);
    } catch (error) {
        errReturned(res, error)
    }
}

/**
 * Get Wallet and its balance change
 */
exports.getWallet = async (req, res) => {
    try {
        console.log(`****** getWallet called`)
        let { id } = req['params'];
        if (!id || id == null || id == undefined) return sendResponse(res, BADREQUEST, "please send an id")

        let walletDetails = await Wallet.findById(id);
        if (!walletDetails) return sendResponse(res, BADREQUEST, "wallet details not found");

        return sendResponse(res, SUCCESS, "wallet Details", walletDetails);
    } catch (error) { errReturned(res, error) }
}

/**
 * All wallets
 */
exports.wallets = async (req, res) => {
    try {

        let wallets = await Wallet.find();
        if (wallets.length < 1) return sendResponse(res, BADREQUEST, "wallets not found");

        return sendResponse(res, SUCCESS, "wallets found successfully", wallets);
    } catch (error) { errReturned(res, error) }
}

/**
 * create transaction
 */
exports.createTransaction = async (req, res) => {
    try {

        // {
        //   "from": the id of the from wallet (make sure the wallet has balance, otherwise fail tx)
        //   "to": the id of the wallet to
        //   "amount": the amount
        // 	"currency": "ETH"
        // }

        const { from, to, amount, currency } = req['body'];
        const data = req['body']
        const required = ['from', 'to', 'amount', 'currency']

        for (let key of required)
            if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null)
                return sendResponse(res, BADREQUEST, `Please enter ${key}`, []);

        if (!currencies.includes(currency)) return sendResponse(res, BADREQUEST, "Invalid currency")

        let fromWallet = await Wallet.findById(from);

        if (!fromWallet) return sendResponse(res, BADREQUEST, "from wallet not found");
        if (!await Wallet.findById(to)) return sendResponse(res, BADREQUEST, "to wallet not found")

        if (fromWallet['balance'] < amount) return sendResponse(res, BADREQUEST, "transaction failed, insufficient gas fees");

        // create a new transaction
        let newTransaction = new Transaction({
            from,
            to,
            amount,
            currency
        });

        // update user table for the balance change

        let response = await Promise.all[
            await newTransaction.save(),
            await Wallet.updateOne({ _id: from }, { $inc: { balance: -amount } }),
            await Wallet.updateOne({ _id: to }, { $inc: { balance: amount } })
        ];
        return sendResponse(res, SUCCESS, "transaction successfull", newTransaction)

    } catch (error) { errReturned(res, error) }
}