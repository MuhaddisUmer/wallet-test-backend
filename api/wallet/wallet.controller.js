const Web3API = require('web3');

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
        

        let data = { account,wallet,keystore};        

        return res.status(200).json({success:true,message:"created",data});
  
    
    } catch (e) { return res.status(400).json({success:false,message:"failed"});}
};


/*
    * get accounts
*/
  exports.getAccounts = async (req, res) => {

    try {
        
        let accounts = await web3.eth.getAccounts();

        return res.status(200).json({success:true,message:"accounts found",accounts});
  
    
    } catch (e) { return res.status(400).json({success:false,message:e.message});}
};
  
  

/*
    * get account balance
*/
  exports.getAccountBalance = async (req, res) => {

    try {

        let account = req.params.account
        if(!account) return res.status(400).json({success:false,message:"provide an account"});
        
        let balance = await web3.eth.getBalance(account);

        return res.status(200).json({success:true,balance});
  
    
    } catch (e) { return res.status(400).json({success:false,message:e.message});}
};