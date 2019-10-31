# BESU on Docker

## Accounts

| Account | Private key |
|---------|-------------|
| 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 | 8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63 |
| 0x627306090abaB3A6e1400e9345bC60c78a8BEf57 | c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 |
| 0xf17f52151EbEF6C7334FAD080c5704D77216b732 | ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f |
| 0xCe77204bFD60cce96A7609013dD2C3be4f56972a | 9AF779C4AE2206F6BA7BBC03D0E9CBFA9D41363586F0171036BF974BB2C7C042 |
| 0x58C55B270fafd50A82E4659B50115231465a747D | FFEC0D7629E0B403F826679497191C6CBD19F8D6E699F368C4C9FFEB174BACB7 |

## JSON-RPC

`docker-compose` creates a separate bridge network for the containers.
The BESU node JSON-RPC can be reached using the following URLs.

| Node | Localhost | Docker network |
|------|-----------|----------------|
| Node 1 | http://localhost:22001 | http://172.21.0.21:8545 |
| Node 2 | http://localhost:22002 | http://172.21.0.22:8545 |
| Node 3 | http://localhost:22003 | http://172.21.0.23:8545 |
| Node 4 | http://localhost:22004 | http://172.21.0.24:8545 |
| Node 5 | http://localhost:22005 | http://172.21.0.25:8545 |

## Start

Navigate to this folder and use the following commands to start the BESU network:
```shell
docker-compose up -d
```

## Stop and cleanup

Use the following command to stop the BESU network and remove the database files:
```shell
./clean.sh
```
**Please note** that this script is intended to be run on Linux and macOS machines. To cleanup on Windows, run the following:
```shell
docker-compose down
```
and then remove `database`, `uploads`, and `private` folder from `node#` data folders, and `routerdb` folder from `orion#` data folders.