// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DigitalReceipt is ERC721, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  string baseURI;

  constructor(
    string memory _initBaseURI
  ) ERC721("DigitalReceipt", "NFTDR") {
    setBaseURI(_initBaseURI);
  }

  function mint() external payable returns (uint256) {
    _tokenIds.increment();
    uint256 newNftTokenId = _tokenIds.current();
    _safeMint(msg.sender, newNftTokenId);

    return newNftTokenId;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function tokenURI(uint256 _tokenId) override public view returns (string memory) {
    require(
      _tokenId <= _tokenIds.current(),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString()))
        : "";
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }


  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function withdraw() public payable onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }
}
