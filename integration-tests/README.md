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

In order to debug:
- https://github.com/80Trill/truffle-intellij-debug
- change test script in `integration-tests/package.json`:
```json
"scripts": {
    "test": "node $NODE_DEBUG_OPTION ./node_modules/.bin/truffle test"
},
```
- add to `integration-tests/truffle-config.js`
```json
{
    ...
    mocha: {
        enableTimeouts: false
    }
}
```
- add compiler option to `tsconfig.json`:
```json
"compilerOptions": {
    ...
    "sourceMap": true
},
```
