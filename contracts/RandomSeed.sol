// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RandomSeed is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant RANDOM_REQUESTER_ROLE = keccak256("RANDOM_REQUESTER_ROLE");

    // The default is 3, but you can set this higher.
    uint16 public constant requestConfirmations = 3;

    // Retrieve 1 random values in one request.
    uint32 public constant numWords = 1;

    event ERC20TokensRemoved(address indexed tokenAddress, address indexed receiver, uint256 amount);

    struct RandomRequest {
        // uint32 chainId;     //  4 Bytes
        uint48 requestTime; //  6 Bytes
        uint48 scheduledTime; //  6 Bytes
        uint48 fullFilledTime; //  6 Bytes
        uint256 requestId; // 32 Bytes
        uint256 randomNumber; // 32 Bytes
    }

    mapping(bytes32 => RandomRequest) public randomRequests; // projectName => RandomRequest
    mapping(uint256 => bytes32) public requestId_to_contract; // requestid => chainId + projectName
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
        require(randomRequests[projectName].requestId == 0, "random number already requested");

        uint256 requestId = block.number;

        randomRequests[projectName].requestTime = uint48(block.timestamp);
        randomRequests[projectName].requestId = requestId;
        requestId_to_contract[requestId] = projectName;
        randomRequestsList.push(projectName);
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
