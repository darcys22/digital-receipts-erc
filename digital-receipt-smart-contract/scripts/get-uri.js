const chalk = require('chalk')
const fs = require('fs')

const name = "DigitalReceipt"
const id = 59

async function main() {

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

  const tokenuri = await digitalreceipts.tokenURI(id);

  console.log(
    '  ',
    chalk.cyan("DigitalReceipt"),
    'TokenURI for tokenID: ',
    id,
    ' is: ',
    chalk.greenBright(tokenuri),
  );

  await fetch(tokenuri).then(res => {
  res.json().then((res) => {
    console.log(
      '  ',
      chalk.cyan("DigitalReceipt"),
      'JSON Metadata: ',
      chalk.greenBright(res),
    );
  });
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
