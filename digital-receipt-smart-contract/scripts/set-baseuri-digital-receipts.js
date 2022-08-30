const chalk = require('chalk')
const fs = require('fs')
const baseuri = "https://receipts.darcyfinancial.com/api/receipt/view/";

const name = "DigitalReceipt"

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Setting digital receipts baseuri with address:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const data = fs.readFileSync(`artifacts/${name}.address`,
    {encoding:'utf8', flag:'r'});

  const Token = await ethers.getContractFactory("DigitalReceipt");

  console.log(
    '  ',
    chalk.cyan("DigitalReceipt"),
    'contract address: ',
    chalk.greenBright(data),
  )

  const digitalreceipts = await Token.attach(data);

  const transaction = await digitalreceipts.setBaseURI(baseuri);
  const receipt = await ethers.provider.getTransactionReceipt(transaction.hash);

  console.log(receipt);

  console.log(
    '  ',
    chalk.cyan("DigitalReceipt"),
    'set baseURI to: ',
    chalk.greenBright(baseuri),
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
