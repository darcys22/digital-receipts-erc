const chalk = require('chalk')
const fs = require('fs')
const axios = require('axios')

const name = "DigitalReceipt"
const id = 12

async function main() {

  const data = fs.readFileSync(`artifacts/${name}.address`,
    {encoding:'utf8', flag:'r'});

  const DigitalReceipts = await ethers.getContractFactory("DigitalReceipt");

  console.log(
    chalk.cyan("DigitalReceipt"),
    'contract address: ',
    chalk.greenBright(data),
  )

  const digitalreceipts = await DigitalReceipts.attach(data);

  const tokenuri = await digitalreceipts.tokenURI(id);

  console.log(
    chalk.cyan("DigitalReceipt"),
    'TokenURI for tokenID: ',
    id,
    ' is: ',
    chalk.greenBright(tokenuri),
  );

  try {
    await axios.get(tokenuri)
      .then(res => {
        if (res.status == 200)
        {
          console.log(
            chalk.cyan("DigitalReceipt"),
            'JSON Metadata: ',
            //chalk.greenBright("\n"+JSON.stringify(res.data, null, 2)),
          );
          console.dir(res.data, {depth: null, colors: true})
        } else {
          console.log("Could not get metadata");
        }
      });
  }
  catch
  {
    console.log("Could not get metadata");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
