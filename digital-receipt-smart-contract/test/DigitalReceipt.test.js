const { expect } = require('chai');
const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;


describe('DigitalReceipt', function () {
  beforeEach(async function () {
    this.ERC721 = await ethers.getContractFactory('DigitalReceipt');
    this.erc721 = await this.ERC721.deploy("something");
    await this.erc721.deployed();
  });

  context('with no minted tokens', async function () {
    it('has 0 totalSupply', async function () {
      const supply = await this.erc721.totalSupply();
      expect(supply).to.equal(0);
    });
  });

  context('mints', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      this.owner = owner;
      this.owneraddress = await this.owner.getAddress();
      this.addr1 = addr1;
      this.addr1address = await this.addr1.getAddress();
      this.addr2 = addr2;
    });

    describe('mint', function () {
      it('successfully mints a single token as owner', async function () {
        const mintTx = await this.erc721.connect(this.owner).mint();
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.owneraddress, 1);
        expect(await this.erc721.ownerOf(1)).to.equal(this.owneraddress);

        await ethers.provider.waitForTransaction(mintTx.hash);
        const receipt = await ethers.provider.getTransactionReceipt(mintTx.hash);
        //console.log(receipt);

      });

      it('successfully mints a single token', async function () {
        const mintTx = await this.erc721.connect(this.addr1).mint()
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.addr1address, 1);
        expect(await this.erc721.ownerOf(1)).to.equal(this.addr1address);

        const supply = await this.erc721.totalSupply();
        expect(supply).to.equal(1);
      });

      it('successfully mints two tokens', async function () {
        const mintTx = await this.erc721.connect(this.addr1).mint()
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.addr1address, 1);
        expect(await this.erc721.ownerOf(1)).to.equal(this.addr1address);

        const mint2Tx = await this.erc721.connect(this.addr1).mint()
        await expect(mint2Tx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.addr1address, 2);
        expect(await this.erc721.ownerOf(1)).to.equal(this.addr1address);

        const supply = await this.erc721.totalSupply();
        expect(supply).to.equal(2);
      });

      it('fails to withdraw if not owner', async function () {
        await expect(
          this.erc721.connect(this.addr1).withdraw()
        ).to.be.revertedWith('Ownable: caller is not the owner');
      });

    });
  });

  context('misc non minting functions', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      this.owner = owner;
      this.owneraddress = await this.owner.getAddress();
      this.addr1 = addr1;
      this.addr1address = await this.addr1.getAddress();
      this.addr2 = addr2;
    });

    describe('token URI after one mint', function () {
      it('shows the correct location', async function () {
        await this.erc721.connect(this.owner).setBaseURI("https://receipts.darcyfinancial.com/api/receipt/view/");
        await expect(
          this.erc721.tokenURI(1)
        ).to.be.revertedWith('ERC721Metadata: URI query for nonexistent token');
        const mintTx = await this.erc721.connect(this.owner).mint();
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
          .withArgs(ZERO_ADDRESS, this.owneraddress, 1);
        await expect(await this.erc721.tokenURI(1))
          .to.equal("https://receipts.darcyfinancial.com/api/receipt/view/1");
      });
    });

    describe('token URI after minting lots', function () {
      it('shows the correct location', async function () {
        await this.erc721.connect(this.owner).setBaseURI("https://receipts.darcyfinancial.com/api/receipt/view/");
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        await this.erc721.connect(this.owner).mint();
        const mintTx = await this.erc721.connect(this.owner).mint();
        await expect(mintTx)
          .to.emit(this.erc721, 'Transfer')
        await expect(await this.erc721.tokenURI(12))
          .to.equal("https://receipts.darcyfinancial.com/api/receipt/view/12");
      });
    });
  });

});
