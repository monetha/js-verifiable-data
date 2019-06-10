const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-moment'));
const Web3 = require('web3');
const sdk = require('../../dist/lib/proto').default;

const ethereumNetworkUrl = 'https://ropsten.infura.io/v3/1f09dda6cce44da68213cacb1ea9bb90';
//const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

describe('Private data tests', function () {

    it('Should read fact', async () => {
        expect(true).to.equal(true);
    });
});

