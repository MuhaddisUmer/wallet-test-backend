const Transaction = require('./transaction.model');

exports.dailyBalanceChange = (wallet) => {
    return new Promise(async (resolve, reject) => {
        try {
            let change = 0;
            let transactions = await Transaction.find({ $or: [{ to: wallet['_id'] }, { from: wallet['_id'] }], createdAt: { $gte: new Date(new Date().getTime() - 24 * 3600 * 1000).toISOString() } }).sort({ createdAt: -1 })
            if (transactions.length > 0)
                for (let transaction of transactions)
                    change = wallet['_id'].toString() == transaction['from'].toString()
                            ? change - transaction['amount']
                            : change + transaction['amount'];

            return resolve(change);
        } catch (e) { reject(e) }
    })
}