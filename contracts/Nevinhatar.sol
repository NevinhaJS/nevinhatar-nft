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

    constructor(string memory _baseURI, uint256 _initialMintAmount)
        ERC721("Nevinhatar", "NEV")
    {
        baseURI = _baseURI;
        mint(msg.sender, _initialMintAmount);
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
        }

        for (uint256 i = 1; i <= _tokenAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
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
}
