const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-moment'));
const Web3 = require('web3');
const sdk = require('reputation-sdk').default;

let accounts;
let monethaOwner;
let passportOwner;
let passportFactoryAddress;
let passportAddress;
let factProviderAddress;

const ethereumNetworkUrl = 'http://127.0.0.1:8545';
const PassportFactory = artifacts.require('PassportFactory');
const PassportLogic = artifacts.require('PassportLogic');
const PassportLogicRegistry = artifacts.require('PassportLogicRegistry');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

before(async () => {
    console.log('Deploy PassportFactory contract and prepare accounts');
    accounts = await web3.eth.accounts;

    monethaOwner = accounts[0];
    passportOwner = accounts[1];
    factProviderAddress = accounts[2];

    const passportLogic = await PassportLogic.new({from: monethaOwner});
    const passportLogicRegistry = await PassportLogicRegistry.new("0.1", passportLogic.address, {from: monethaOwner});
    
    const passportFactory = await PassportFactory.new(passportLogicRegistry.address, {from: monethaOwner}); 
    passportFactoryAddress = passportFactory.address;
})

describe('Reputation js-sdk smoke tests', function () {
    it('Should be able to create passport', async () => {
        // Given
        const generator = new sdk.PassportGenerator(web3, passportFactoryAddress);
        // When
        const response = await generator.createPassport(passportOwner);
        const transaction = await submitTransaction(response);
        const receipt = await web3.eth.getTransactionReceipt(transaction.hash);
        // Then
        passportAddress = '0x' + receipt.logs[0].topics[1].slice(26);
        expect(transaction.from).to.equal(passportOwner);
        expect(transaction).to.have.property('to');
        expect(transaction).to.have.property('input');
        expect(transaction.input).to.equal('0x2ec0faad'); // '0x2ec0faad' is createPassport() method id
    });

    it('Should be able to claim ownership', async () => {
        // Given
        const generator = new sdk.PassportOwnership(web3, passportAddress);
        // When
        const response = await generator.claimOwnership(passportOwner);
        const transaction = await submitTransaction(response);
        // Then
        expect(transaction.from).to.equal(passportOwner);
        expect(transaction).to.have.property('to');
        expect(transaction).to.have.property('input');
        expect(transaction.input).to.equal('0x4e71e0c8'); // '0x2ec0faad' is claimOwnership() method id
    });

    it('Should be able to get a list of all created passports', async () => {
        // Given
        const reader = new sdk.PassportReader(web3, ethereumNetworkUrl);
     
        // When
        const response = await reader.getPassportsList(passportFactoryAddress);
        // Then
        expect(response[0]).to.have.property('passportAddress');
        expect(response[0]).to.have.property('ownerAddress');
    });

    it('Should be able to write facts', async () => {
        // Given
        const writer = new sdk.FactWriter(web3, passportAddress);

        // When
        const response = await writer.setString('greetings', 'hello', factProviderAddress);
        const transaction = await submitTransaction(response);

        // Then
        expect(transaction.from).to.equal(factProviderAddress);
        expect(transaction).to.have.property('to');
        expect(transaction).to.have.property('input');
    });

    it('Should be able to read facts from the passport.', async () => {
        // Given
        const reader = new sdk.FactReader(web3, ethereumNetworkUrl, passportAddress);
        // When
        const response = await reader.getString(factProviderAddress, 'greetings');
        // Then
        expect(response).to.equal('hello');
    });

    it('Should be able to delete data stored from the passport.', async () => {
        // Given
        const remover = new sdk.FactRemover(web3, passportAddress);
        // When
        const response = await remover.deleteString('greetings', factProviderAddress);
        const transaction = await submitTransaction(response);
        // Then
        expect(transaction.from).to.equal(factProviderAddress);
        expect(transaction).to.have.property('to');
        expect(transaction).to.have.property('input');
    });

    it('Should be able read facts history.', async () => {
        // Given
        const reader = new sdk.PassportReader(web3, ethereumNetworkUrl);
        // When
        const response = await reader.readPassportHistory(passportAddress);
        // Then
        expect(response[1].factProviderAddress).to.equal(factProviderAddress);
        expect(response[1]).to.have.property('blockNumber');
        expect(response[1]).to.have.property('transactionHash');
        expect(JSON.stringify(response)).to.contains('greetings');
    });

    it('Should be able to whitelist fact provide.', async () => {
        // Given
        const permissions = new sdk.Permissions(web3, passportAddress);
        // When
        const response = await permissions.addFactProviderToWhitelist(factProviderAddress, passportOwner);
        const transaction = await submitTransaction(response);
        // Then
        expect(transaction.from).to.equal(passportOwner);
        expect(transaction).to.have.property('to');
        expect(transaction).to.have.property('input');
    });

});

async function submitTransaction(tx_data) {
    const tx = await web3.eth.sendTransaction({
        from: tx_data.from,
        to: tx_data.to,
        nonce: tx_data.nonce,
        gasPrice: tx_data.gasPrice,
        gas: tx_data.gasLimit,
        value: tx_data.value,
        data: tx_data.data,
    });
    let transaction = web3.eth.getTransaction(tx);
    return transaction;
  }
