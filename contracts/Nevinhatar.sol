// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Nevinhatar is Ownable, ERC721Enumerable {
    using Strings for uint256;

    string public baseURI;
    string internal baseExtension = ".json";
    uint256 public maxSupply = 1000;
    uint8 public maxTokenPerMint = 20;
    uint256 public preSaleStart = 1640287841;
    uint256 public preSaleEnd = 1640287841 + 5 minutes;
    uint256 public preSaleCost = 0.02 ether;
    uint256 public saleCost = 0.06 ether;

    // TODO:
    // Pause the contract
    // Resume the contract
    // Reveal a token

    constructor(string memory _baseURI, uint256 _initialMintAmount)
        ERC721("Nevinhatar", "NEV")
    {
        baseURI = _baseURI;
        mint(msg.sender, _initialMintAmount);
    }

    function validateNFTCost(uint256 _tokenAmount) internal {
        if (block.timestamp <= preSaleEnd) {
            require(
                msg.value >= preSaleCost * _tokenAmount,
                "Not enough ether provided on pre sale"
            );
        } else {
            require(
                msg.value >= saleCost * _tokenAmount,
                "Not enough ether provided on public sale"
            );
        }
    }

    function mint(address _to, uint256 _tokenAmount) public payable {
        uint256 supply = totalSupply();
        bool isOwner = msg.sender == owner();

        if (!isOwner) {
            require(
                _tokenAmount + supply <= maxSupply,
                "Token amount exceeds max supply"
            );
            require(
                _tokenAmount <= maxTokenPerMint,
                "Token amount exceeds max token per mint"
            );
            require(block.timestamp >= preSaleStart, "Pre-sale not started");

            validateNFTCost(_tokenAmount);
        }

        for (uint256 i = 1; i <= _tokenAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        _tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function setPreSaleStartDate(uint256 _preSaleStart) public onlyOwner {
        preSaleStart = _preSaleStart;
    }

    function setPreSaleEndDate(uint256 _preSaleEnd) public onlyOwner {
        preSaleEnd = _preSaleEnd;
    }
}
