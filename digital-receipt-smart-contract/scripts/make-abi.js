const fs = require('fs')

async function main() {
  const contract = require("../artifacts/contracts/DigitalReceipt.sol/DigitalReceipt.json");
  fs.writeFileSync(`artifacts/abi.json`, JSON.stringify(contract.abi));
  console.log("Abi saved to artifacts/abi.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

