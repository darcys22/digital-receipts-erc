const chalk = require('chalk')
const fs = require('fs')

const name = "DigitalReceipt"

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory(name);

  // Metadata URL
  const token = await Token.deploy("");

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

