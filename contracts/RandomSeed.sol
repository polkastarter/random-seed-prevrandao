// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RandomSeed is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant RANDOM_REQUESTER_ROLE = keccak256("RANDOM_REQUESTER_ROLE");

    event ERC20TokensRemoved(address indexed tokenAddress, address indexed receiver, uint256 amount);

    // variables to calculate wait time
    uint public blocksWait = 128;
    uint public blockTime = 15;

    struct RandomRequest {
        // uint16 chainId;     //  2 Bytes
        uint48 requestTime; //  6 Bytes
        uint48 requestId; // 6 Bytes (blockNumber at request time)
        uint48 scheduledBlock; //  6 Bytes
        uint48 scheduledTime; //  6 Bytes
        uint48 fullFilledTime; //  6 Bytes
        uint48 fullFilledBlock; //  6 Bytes
        uint256 randomNumber; // 32 Bytes
    }

    mapping(bytes32 => RandomRequest) public randomRequests; // projectName => RandomRequest
    // mapping(uint256 => bytes32) public requestId_to_contract; // requestid => chainId + projectName
    bytes32[] public randomRequestsList;

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "caller has not admin role");
        _;
    }

    modifier onlyRandomRequesterRole() {
        require(hasRole(RANDOM_REQUESTER_ROLE, msg.sender), "caller has not RandomRequesterRole");
        _;
    }

    /**
     * @dev CONSTRUCTOR
     */

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(RANDOM_REQUESTER_ROLE, msg.sender);
    }

    /**
     * @dev map a chainID and a contract address to a uint256
     * @param _chainId of blockchain where contract is deployed
     * @param _contractAddress contract addressbytes(str).length
     */
    function chainIdAddressToUint256(uint32 _chainId, address _contractAddress) public pure returns (uint256) {
        return (uint256(_chainId) << 160) | uint256(uint160(_contractAddress));
    }

    function stringToBytes32(string memory projectNameString) public pure returns (bytes32) {
        uint len = bytes(projectNameString).length;
        require(len > 0 && len <= 32, "project name length =0 OR >32");
        return bytes32(bytes(projectNameString));
    }

    /**
     * @dev Request a random number
     * @param projectNameString name of project
     */
    function requestRandomWords(string memory projectNameString) external onlyRandomRequesterRole {
        bytes32 projectName = stringToBytes32(projectNameString);
        uint256 blockNumberToBeUsed = randomRequests[projectName].requestId;

        if (blockNumberToBeUsed == 0) {
            // first run, determine block number to be used
            randomRequests[projectName].requestTime = uint48(block.timestamp);
            randomRequests[projectName].requestId = uint48(block.number);
            randomRequests[projectName].scheduledBlock = uint48(block.number + blocksWait);
            randomRequests[projectName].scheduledTime = uint48(block.timestamp + (blocksWait * blockTime));
            // requestId_to_contract[block.number] = projectName;
            randomRequestsList.push(projectName);
        } else {
            require(block.number >= (randomRequests[projectName].requestId + blocksWait), "wait period not over");
            uint256 randomNumber = block.prevrandao;
            require(randomNumber != 0, "randomNumber is (still) 0");
            randomRequests[projectName].randomNumber = randomNumber;
            randomRequests[projectName].fullFilledTime = uint48(block.timestamp);
        }
    }

    function getScheduledTime(string memory projectNameString) public view returns (uint48) {
        bytes32 projectName = stringToBytes32(projectNameString);
        return randomRequests[projectName].scheduledTime;
    }

    function getRandomNumber(string memory projectNameString) public view returns (uint256) {
        bytes32 projectName = stringToBytes32(projectNameString);
        return randomRequests[projectName].randomNumber;
    }

    function getScheduleRequest(string memory projectNameString) public view returns (RandomRequest memory) {
        bytes32 projectName = stringToBytes32(projectNameString);
        return randomRequests[projectName];
    }

    /**
     * admin functions
     */

    function setBlocksWait(uint48 _blocksWait) external onlyOwner {
        blocksWait = _blocksWait;
    }

    function setBlockTime(uint48 _blockTime) external onlyOwner {
        blockTime = _blockTime;
    }

    /**
     * Do not accept accidently sent ETH :
     * If neither a receive Ether nor a payable fallback function is present,
     * the contract cannot receive Ether through regular transactions and throws an exception.
     * https://docs.soliditylang.org/en/v0.8.7/contracts.html#receive-ether-function
     */

    /**
     * @notice withdraw accidently sent ERC20 tokens
     * @param _tokenAddress address of token to withdraw
     */
    function withdrawERC20Tokens(address _tokenAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = IERC20(_tokenAddress).balanceOf(address(this));
        IERC20(_tokenAddress).safeTransfer(msg.sender, balance);
        emit ERC20TokensRemoved(_tokenAddress, msg.sender, balance);
    }
}
