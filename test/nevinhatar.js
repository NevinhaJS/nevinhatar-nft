const Nevinhatar = artifacts.require("Nevinhatar");

contract('Nevinhatar', (accounts) => {
  it('should have ipfs as base URL when it is deployed', async () => {
    const contract = await Nevinhatar.deployed();
    const baseURI = await contract.baseURI.call();

    assert.equal(baseURI, "ipfs://hfiyaduhasdj/");
  })

  it('should mint NFTs to the owner of the contract when it is deployed', async () => {
    const contract = await Nevinhatar.deployed();
    const ownerBalance = (await contract.balanceOf.call(accounts[0])).toNumber();
    const maxTokenPerMint = (await contract.maxTokenPerMint.call()).toNumber();

    assert.equal(ownerBalance, maxTokenPerMint);
  })

  it('should update baseURI', async () => {
    const contract = await Nevinhatar.new('ipfs://asdasdsad/as', 20);
    const newBaseURI = "ipfs://hfiyaduhasdj/new";

    await contract.setBaseURI(newBaseURI)

    contract.baseURI().then(url => {
        assert.equal(url, newBaseURI);
    })
  })

  it('should return a valid baseURI', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const baseURI = await contract.baseURI(); 
    const tokenURI = await contract.tokenURI(2);

    assert.equal(tokenURI, `${baseURI}2.json`);
  })
})