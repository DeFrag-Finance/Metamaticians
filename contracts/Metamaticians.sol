//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

// DEFRAG NFT
// 100% ON CHAIN GENERATED ART
// UTILIZES CHAINLINK VRF FOR RANDOM NUMBER GENERATION
// USE UNISWAP TO SWAP ETH FOR LINK WHICH IS PAID TO CHAINLINK

import "./interfaces/IMetamaticiansAttributes.sol";
// Checkoointable is for DAO control
// https://medium.com/tally-blog/how-to-create-an-nft-dao-47669a9e4e3a
import "./ERC721Checkpointable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract Metamaticians is
    ERC721Checkpointable,
    Ownable,
    ReentrancyGuard,
    VRFConsumerBase {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    using Strings for string;
    using Strings for uint256;

    IUniswapV2Router02 public uniswapRouter;

    bytes32 internal keyHash;
    uint256 internal fee;
    address public VRFCoordinator;
    address public LinkToken;
    uint256 public royaltyFee;
    address public MetamaticianAttributesAddress;

    uint constant public MAX_MINTS = 8000;
    uint constant public OWNER_MINTS = 1600;
    uint constant public PUBLIC_MINTS = 6400;
    uint constant public MINT_LIMIT_PER_ADDRESS = 50;
    uint constant public MINT_FEE = 0.618 ether;
    uint constant RESERVE_TREASURY_MINTING_FEE = 500000000000000000;

    mapping(bytes32 => address) public requestIdToMinter;
    mapping(address => bytes32) public minterToRequestId;
    mapping(uint256 => address) public tokenIdToOwner;
    mapping(uint256 => uint256) public tokenIdToPieceOfPi;
    mapping(bytes32 => uint256) public requestIdToToken;

    event MintAttempt(address indexed _minter, uint _quantity);
    event OwnerMintAttempt(address indexed _minter, uint _quantity);
    event TokenGeneration(address indexed _minter, uint _tokenId, uint _randomNumber);
    event RandomNumberFullfilled(address indexed _minter, uint _tokenId, uint _randomNumber);
    event NewRoyaltySet(uint _oldRoyalty, uint _newRoyalty);
    event RandomnessRequested(address indexed _minter);
    event SwapCompleted(uint _amount);

    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash, uint256 _fee, address _metamaticianAttributesAddress, address _uniswapRouter)
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("Metamaticians", "METAMATH")
    {
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        keyHash = _keyhash;
        fee = _fee;
        MetamaticianAttributesAddress = _metamaticianAttributesAddress;
        royaltyFee = 500;

        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    function mintItem(uint256 _quantity, uint256 _deadline)
        external
        payable
        nonReentrant
    {
        require(_quantity <= MINT_LIMIT_PER_ADDRESS, "Max quantity 50");
        require((_tokenIds.current() + _quantity) <= PUBLIC_MINTS, "Exceeding public mints");
        require(msg.value == (MINT_FEE * _quantity), "Required amount per NFT: 0.618 ETH");
        require((ERC721.balanceOf(msg.sender) + _quantity) <= MINT_LIMIT_PER_ADDRESS, "Mint limit reached per account");

        emit MintAttempt(msg.sender, _quantity);

        // Swap ETH for LINK to pay for the VRF call and the future treasury mints
        uint256 amountOut = (fee + RESERVE_TREASURY_MINTING_FEE) * _quantity;
		address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = LinkToken;

        uniswapRouter.swapETHForExactTokens{value: msg.value}(amountOut, path, address(this), _deadline);

        for (uint256 i = 0; i < _quantity; i++) {
            emit RandomnessRequested(msg.sender);

            bytes32 requestId = requestRandomness(keyHash, fee);
            requestIdToMinter[requestId] = msg.sender;
            minterToRequestId[msg.sender] = requestId;

            _tokenIds.increment();
            uint tokenId = _tokenIds.current();

            requestIdToToken[requestId] = tokenId;
            tokenIdToOwner[tokenId] = msg.sender;
            _safeMint(requestIdToMinter[requestId], tokenId);
        }
    }

    function ownerMintItem(uint256 _quantity)
        external
        onlyOwner
    {
        require((_tokenIds.current() + _quantity) <= MAX_MINTS, "Owner mints not available");

        emit OwnerMintAttempt(msg.sender, _quantity);

        for (uint256 i = 0; i < _quantity; i++) {
            emit RandomnessRequested(msg.sender);

            bytes32 requestId = requestRandomness(keyHash, fee);
            requestIdToMinter[requestId] = msg.sender;
            minterToRequestId[msg.sender] = requestId;

            _tokenIds.increment();
            uint tokenId = _tokenIds.current();

            requestIdToToken[requestId] = tokenId;
            tokenIdToOwner[tokenId] = msg.sender;
            _safeMint(requestIdToMinter[requestId], tokenId);
        }
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        // because VRF utilizes the entirety of uint256, we can't guarantee the return number to be a ceratin size
        // we hash the random number, turn it into a string, and pluck out the first 8 digits
        // this way we can always guarantee pieceOfPi to be 8 digits
        bytes32 randomHash = keccak256(abi.encode(requestId, randomNumber));
        string memory randomHashString = uint(randomHash).toString();
        string memory subString = substring(randomHashString, 8, 0);
        uint pieceOfPi = stringToUint(subString);

        address owner = requestIdToMinter[requestId];
        uint tokenId = requestIdToToken[requestId];
        tokenIdToPieceOfPi[tokenId] = pieceOfPi;

        emit RandomNumberFullfilled(owner, tokenId, randomNumber);
    }

    function svg(uint256 tokenId) public view returns (string memory) {
        uint pieceOfPi = tokenIdToPieceOfPi[tokenId];
        require(pieceOfPi != 0, "does not exist");

        return IMetamaticiansAttributes(MetamaticianAttributesAddress).getSVG(pieceOfPi, tokenId);
    }

    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        uint pieceOfPi = tokenIdToPieceOfPi[tokenId];

        require(pieceOfPi != 0, "does not yet exist");

        string memory name = getName(pieceOfPi);
        string memory suffix = getSuffix(pieceOfPi);
        string memory greekName = getGreekName(pieceOfPi);

        string memory json = string(
            abi.encodePacked(
                '{',
                    '"description": "Metamaticians are randomly generated and have 100% on-chain art and metadata",',
                    '"external_url": "https://defrag.fi/",',
                    '"image": "', svg(tokenId), '",',
                    '"attributes": [',
                        '{',
                            '"trait_type": "Name",',
                            '"value": "', name, '"',
                        '},',
                        '{',
                            '"trait_type": "Suffix",',
                            '"value": "', suffix, '"',
                        '},',
                        '{',
                            '"trait_type": "Greek",',
                            '"value": "', greekName, '"',
                        '},',
                        '{',
                            '"trait_type": "Piece of Pi",',
                            '"value": "', pieceOfPi.toString(), '"',
                        '},',
                        '{',
                            '"display_type": "date",',
                            '"trait_type": "Birthday",',
                            '"value": "', block.timestamp.toString(), '"',
                        '}',
                    ']',
                '}'
            )
        );

        // because all of the NFT information is generated on chain, we base64 encode the data on return
        // this information is not stored anywhere else, except for the contracts themselves
        string memory encodedJson = Base64.encode(bytes(json));
        string memory output = string(abi.encodePacked("data:application/json;base64,", encodedJson));
        return output;
    }

    // https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public view returns (string memory) {
        address owner = owner();
        string memory json = string(
            abi.encodePacked(
                '{',
                    '"name": "Metamaticians",',
                    '"description": "Metamaticians are randomly generated and have 100% on-chain art and metadata. All of the minting proceeds are deposited into the DeFrag DAO Treasury and will be used to jumpstart the first NFT underwriting pool. Each Metamatician NFT has an attached ETH staked value in this underwriting pool which will accrue option premium fees in perpetuity. Learn more on our docs!",',
                    '"image": "https://defrag.fi/opensea-image.png",',
                    '"external_link": "https://defrag.fi/",',
                    '"seller_fee_basis_points": ', royaltyFee.toString(), ',',
                    '"fee_recipient": "', addressToString(owner), '"',
                '}'
            )
        );
        string memory encodedJson = Base64.encode(bytes(json));
        string memory output = string(abi.encodePacked("data:application/json;base64,", encodedJson));
        return output;
    }

    function withdrawLINK(address to, uint256 value) public onlyOwner {
        require(LINK.transfer(to, value), "Not enough LINK");
    }

    function withdraw() public onlyOwner {
		(bool success, ) = msg.sender.call{value: address(this).balance}("");
		require(success, "Withdrawal failed");
	}

    function setNewRoyaltyFeeBasisPoints(uint newRoyalty) public onlyOwner {
        uint oldRoyalty = royaltyFee;
		royaltyFee = newRoyalty;
        emit NewRoyaltySet(oldRoyalty, newRoyalty);
	}

    receive() external payable {
        emit SwapCompleted(msg.value);
    }

    function getName(uint pieceOfPie) internal view returns (string memory) {
        return IMetamaticiansAttributes(MetamaticianAttributesAddress).getName(pieceOfPie);
    }

    function getSuffix(uint pieceOfPie) internal view returns (string memory) {
        return IMetamaticiansAttributes(MetamaticianAttributesAddress).getSuffix(pieceOfPie);
    }

    function getGreek(uint pieceOfPie) internal view returns (string memory) {
        return IMetamaticiansAttributes(MetamaticianAttributesAddress).getGreek(pieceOfPie);
    }

    function getGreekName(uint pieceOfPie) internal view returns (string memory) {
        return IMetamaticiansAttributes(MetamaticianAttributesAddress).getGreekName(pieceOfPie);
    }

    // helpers
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }

        return string(str);
    }

    function substring(string memory _base, int _length, int _offset)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);

        assert(uint(_offset + _length) <= _baseBytes.length);

        string memory _tmp = new string(uint(_length));
        bytes memory _tmpBytes = bytes(_tmp);

        uint j = 0;
        for (uint i = uint(_offset); i < uint(_offset + _length); i++) {
            _tmpBytes[j++] = _baseBytes[i];
        }

        return string(_tmpBytes);
    }

    function stringToUint(string memory numString) internal pure returns(uint) {
        uint  val=0;
        bytes   memory stringBytes = bytes(numString);
        for (uint  i =  0; i < stringBytes.length; i++) {
            uint exp = stringBytes.length - i;
            bytes1 ival = stringBytes[i];
            uint8 uval = uint8(ival);
            uint jval = uval - uint(0x30);

           val +=  (uint(jval) * (10**(exp-1)));
        }
      return val;
    }
}
