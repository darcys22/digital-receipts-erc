.PHONY: test clean compile deploy

test:
	npx hardhat test

compile:
	npx hardhat compile

deploy:
	npx hardhat run scripts/deploy-digital-receipts-contract.js --network goerli
