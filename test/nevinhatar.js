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

  it('should not allow the mint if the presale date is not opened', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const date = new Date()
    const startDate = date.setMinutes(date.getMinutes() + 10);
    const value = web3.utils.toWei('0.02', 'ether')
    let error;
    
    await contract.setPreSaleStartDate(Math.floor(startDate / 1000));

    try {
      await contract.mint(accounts[1], 1, {from: accounts[1], value});
    }catch(err) {
      error = err;
    }

    assert.equal(error?.message?.includes("Pre-sale not started."), true);
  })

  it('should not allow the mint if the ether value is less the expected value', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const [startDateInstance, endDateInstance] = [new Date(), new Date()]
    const startDate = startDateInstance.setMinutes(startDateInstance.getMinutes() - 1)
    const endDate = endDateInstance.setMinutes(endDateInstance.getMinutes() + 10)
    const value = web3.utils.toWei('0.02', 'ether')
    let error;
    
    await contract.setPreSaleStartDate(Math.floor(startDate / 1000));
    await contract.setPreSaleEndDate(Math.floor(endDate / 1000));

    try {
      await contract.mint(accounts[1], 2, {from: accounts[1], value});
    }catch(err) {
      error = err;
    }

    assert.equal(error?.message?.includes("Not enough ether provided on pre sale"), true);
  })

  it('should not allow the mint if the ether value is less the expected value', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const [startDateInstance, endDateInstance] = [new Date(), new Date()]
    const startDate = startDateInstance.setMinutes(startDateInstance.getMinutes() - 1)
    const endDate = endDateInstance.setMinutes(endDateInstance.getMinutes() - 10)
    const value = web3.utils.toWei('0.04', 'ether')
    let error;
    
    await contract.setPreSaleStartDate(Math.floor(startDate / 1000));
    await contract.setPreSaleEndDate(Math.floor(endDate / 1000));

    try {
      await contract.mint(accounts[1], 1, {from: accounts[1], value});
    }catch(err) {
      error = err;
    }

    assert.equal(error?.message?.includes("Not enough ether provided on public sale"), true);
  })

  it('should allow buying a token in a pre-sale price', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const [startDateInstance, endDateInstance] = [new Date(), new Date()]
    const startDate = startDateInstance.setMinutes(startDateInstance.getMinutes() - 1)
    const endDate = endDateInstance.setMinutes(endDateInstance.getMinutes() + 10)
    const value = web3.utils.toWei('0.02', 'ether')
    
    await contract.setPreSaleStartDate(Math.floor(startDate / 1000));
    await contract.setPreSaleEndDate(Math.floor(endDate / 1000));
    
    await contract.mint(accounts[2], 1, {from: accounts[2], value});

    const balance = (await contract.balanceOf.call(accounts[2])).toNumber();

    assert.equal(balance, 1);
  })

  it('should allow buying a token in a public sale price', async () => {
    const contract = await Nevinhatar.new('ipfs://nevinhatar-hash/', 20);
    const [startDateInstance, endDateInstance] = [new Date(), new Date()]
    const startDate = startDateInstance.setMinutes(startDateInstance.getMinutes() - 1)
    const endDate = endDateInstance.setMinutes(endDateInstance.getMinutes() - 10)
    const value = web3.utils.toWei('0.06', 'ether')
    
    await contract.setPreSaleStartDate(Math.floor(startDate / 1000));
    await contract.setPreSaleEndDate(Math.floor(endDate / 1000));
    
    await contract.mint(accounts[2], 1, {from: accounts[2], value});

    const balance = (await contract.balanceOf.call(accounts[2])).toNumber();

    assert.equal(balance, 1);
  })
})