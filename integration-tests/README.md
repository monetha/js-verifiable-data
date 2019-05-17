## How to run tests

Before running test make sure that contracts folder in integration-tests is up to date.

Install mocha
```
npm install -g mocha
```

Install ganache-cli
```
npm install -g ganache-cli
```

Install truffle
```
npm install -g truffle
```

In separate terminal run next command:
```
ganache-cli
```

In a main terminal from the integration-tests folder run next command:
```
truffle test
```