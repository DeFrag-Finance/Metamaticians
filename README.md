# [DeFrag Metamatician NFTs](https://defrag.fi/)

[![CircleCI](https://circleci.com/gh/DeFrag-Finance/nft-sc.svg?style=shield&circle-token=45b9452d10a28098c3522cceb214170fc2c0ac24)](<LINK>)

## Overview
100% on chain generated art, utilizing Uniswap and Chainlink VRF, and used for DAO governance. Based on [Chainlink Hardhat Box](https://github.com/smartcontractkit/hardhat-starter-kit) and [Tally Governance Guidelines](https://medium.com/tally-blog/how-to-create-an-nft-dao-47669a9e4e3a).

### Setup
```shell
yarn install
yarn test
```

### Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

### Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

### Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).


<br/>
<p align="center">
<a href="https://chain.link" target="_blank">
<img src="https://raw.githubusercontent.com/smartcontractkit/chainlink-hardhat-box/master/box-img-lg.png" width="225" alt="Chainlink Hardhat logo">
</a>
</p>
<br/>

# Chainlink Hardhat Box
 Implementation of the following 3 Chainlink features using the [Hardhat](https://hardhat.org/) development environment:
 - [Request & Receive data](https://docs.chain.link/docs/request-and-receive-data)
 - [Chainlink Price Feeds](https://docs.chain.link/docs/using-chainlink-reference-contracts)
 - [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf)

 ## Requirements

- [NPM](https://www.npmjs.com/) or [YARN](https://yarnpkg.com/)

## Installation

### Kovan Ethereum Testnet
Set your `KOVAN_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). You can get one for free at [Infura's site.](https://infura.io/) You'll also need to set the variable `PRIVATE_KEY`, which is your private key from your wallet, ie MetaMask. This is needed for deploying contracts to public networks. You can optionally set your `MNEMONIC` environment variable instead with some changes to the `hardhat.config.js`.

### Matic Mumbai Testnet
Set your `MUMBAI_RPC_URL` [environment variable](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). You can get one from the [Matic docs](https://docs.matic.network/docs/develop/network-details/network). You'll also need to set the variable `PRIVATE_KEY` which is your private key from your wallet, ie MetaMask. This is needed for deploying contracts to public networks. You can obtain testnet MATIC and LINK via the [MATIC Faucet](https://faucet.matic.network/)

### Setting Environment Variables
You can set these in your `.env` file if you're unfamiliar with how setting environment variables work. Check out our [.env example](https://github.com/smartcontractkit/hardhat-starter-kit/blob/main/.env.example). If you wish to use this method to set these variables, update the values in the .env.example file, and then rename it to '.env'

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

`.env` example:
```
KOVAN_RPC_URL='www.infura.io/asdfadsfafdadf'
PRIVATE_KEY='abcdef'
MAINNET_RPC_URL="https://eth-mainnet.alchemyapi.io/v2/your-api-key"
MUMBAI_RPC_URL='https://rpc-mumbai.maticvigil.com'
POLYGON_MAINNET_RPC_URL='https://rpc-mainnet.maticvigil.com'
```
`bash` example
```
export KOVAN_RPC_URL='www.infura.io/asdfadsfafdadf'
export PRIVATE_KEY='abcdef'
export MAINNET_RPC_URL='https://eth-mainnet.alchemyapi.io/v2/your-api-key'
export MUMBAI_RPC_URL='https://rpc-mumbai.maticvigil.com'
export POLYGON_MAINNET_RPC_URL='https://rpc-mainnet.maticvigil.com'
```

If you plan on deploying to a local [Hardhat network](https://hardhat.org/hardhat-network/) that's a fork of the Ethereum mainnet instead of a public test network like Kovan, you'll also need to set your `MAINNET_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) and uncomment the `forking` section in `hardhat.config.js`. You can get one for free at [Alchemy's site.](https://alchemyapi.io/).

You can also use a `PRIVATE_KEY` instead of a `MNEMONIC` environment variable by uncommenting the section in the `hardhat.config.js`, and commenting out the `MNEMONIC` line.

Then you can install all the dependencies

```bash
git clone https://github.com/smartcontractkit/hardhat-starter-kit/
cd hardhat-starter-kit
```
then

```bash
npm install
```

Or

```bash
yarn
```


## Auto-Funding

This Starter Kit is configured by default to attempt to auto-fund any newly deployed contract that uses Any-API or Chainlink VRF, to save having to manually fund them after each deployment. The amount in LINK to send as part of this process can be modified in the [Starter Kit Config](https://github.com/smartcontractkit/chainlink-hardhat-box/blob/main/helper-hardhat-config.js), and are configurable per network.

| Parameter  | Description                                       | Default Value |
| ---------- | :------------------------------------------------ | :------------ |
| fundAmount | Amount of LINK to transfer when funding contracts | 1 LINK        |

If you wish to deploy the smart contracts without performing the auto-funding, run the following command when doing your deployment:

```bash
npx hardhat deploy --tags main
```


## Deploy

Deployment scripts are in the [deploy](https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/deploy) directory. If required, edit the desired environment specific variables or constructor parameters in each script, then run the hardhat deployment plugin as follows. If no network is specified, it will default to the Kovan network.

This will deploy to a local hardhat network

This will deploy to a local hardhat network

```bash
npx hardhat deploy
```

To deploy to testnet:
```bash
npx hardhat deploy --network kovan
```

## Test
Tests are located in the [test](https://github.com/smartcontractkit/hardhat-starter-kit/tree/main/test) directory, and are split between unit tests and integration tests. Unit tests should only be run on local environments, and integration tests should only run on live environments.

To run unit tests:

```bash
yarn test
```

To run integration tests:

```bash
yarn test-integration
```

## Run

The deployment output will give you the contract addresses as they are deployed. You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract


### Chainlink Price Feeds
The Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
npx hardhat read-price-feed --contract insert-contract-address-here --network network
```

### Request & Receive Data
The APIConsumer contract has two tasks, one to request external data based on a set of parameters, and one to check to see what the result of the data request is. This contract needs to be funded with link first:

```bash
npx hardhat fund-link --contract insert-contract-address-here --network network
```

Once it's funded, you can request external data by passing in a number of parameters to the request-data task. The contract parameter is mandatory, the rest are optional

```bash
npx hardhat request-data --contract insert-contract-address-here --network network
```

Once you have successfully made a request for external data, you can see the result via the read-data task
```bash
npx hardhat read-data --contract insert-contract-address-here --network network
```


### VRF Get a random number
The VRFConsumer contract has two tasks, one to request a random number, and one to read the result of the random number request. This contract needs to be funded with link first:

```bash
npx hardhat fund-link --contract insert-contract-address-here --network network
```

Once it's funded, you can perform a VRF request with the request-random-number task:

```bash
npx hardhat request-random-number --contract insert-contract-address-here --network network
```

Once you have successfully made a request for a random number, you can see the result via the read-random-number task:

```bash
npx hardhat read-random-number --contract insert-contract-address-here --network network
```

### Keepers
The KeepersCounter contract is a simple Chainlink Keepers enabled contract that simply maintains a counter variable that gets incremented each time the performUpkeep task is performed by a Chainlink Keeper. Once the contract is deployed, you should head to [https://keepers.chain.link/](https://keepers.chain.link/) to register it for upkeeps, then you can use the task below to view the counter variable that gets incremeneted by Chainlink Keepers


```bash
npx hardhat read-keepers-counter --contract insert-contract-address-here --network network
```

## Verify on Etherscan

You'll need an `ETHERSCAN_API_KEY` environment variable. You can get one from the [Etherscan API site.](https://etherscan.io/apis)

```
npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
```
example:

```
npx hardhat verify --network kovan 0x9279791897f112a41FfDa267ff7DbBC46b96c296 "0x9326BFA02ADD2366b30bacB125260Af641031331"
```

### Linting

```
yarn lint:fix
```
