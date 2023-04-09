const Web3 = require('web3');
// const HDWalletProvider = require('@truffle/hdwallet-provider');

let providerWS = new Web3.providers.WebsocketProvider(
  process['env']['NETWORK_SOCKET_LINK'], {
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  }
});
let web3Socket = new Web3(providerWS);
let web3 = new Web3(new Web3.providers.HttpProvider(process['env']['PROVIDER']));

module.exports = { web3, web3Socket };