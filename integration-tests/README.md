# Run integration tests

**Please note:** before running integration tests, please make sure that the `contracts` folder in `integration-tests` is up to date.

## Dependencies

**Please note** that all of the commands must be run in `integration-tests` folder.

Before running the tests, install dependencies:

```shell
npm install
```

If you Docker, please start `ganache-cli` on it:

```shell
npm run ganache
```

You can stop and remove it after running the tests with the following commands:

```shell
npm run ganache:stop
```

If you do NOT have Docker, you will need to open a separate terminal window, navigate to the `integration-tests` folder, and run the following command:

```shell
npm run ganache:terminal
```

## Run the tests

In a main terminal from the `integration-tests` folder run the following command:

```shell
npm run test
```

In order to debug:

- [https://github.com/80Trill/truffle-intellij-debug](https://github.com/80Trill/truffle-intellij-debug)
- change test script in `integration-tests/package.json`:

```json
"scripts": {
    ...
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
