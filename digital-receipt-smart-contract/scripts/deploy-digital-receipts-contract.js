const chalk = require('chalk')
const fs = require('fs')

const name = "digitalreceipts"

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Hoomans");

  // Description, Token, Metadata URL, Hidden URL
  const token = await Token.deploy("Digital Receipts", "NFTDR", "");

  console.log(
    '  ',
    chalk.cyan(`${name}`),
    'deployed to:',
    chalk.greenBright(token.address),
  )
  fs.writeFileSync(`artifacts/${name}.address`, token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

