// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomSeed is VRFConsumerBaseV2, AccessControl {
    bytes32 public constant RANDOM_REQUESTER_ROLE = keccak256("RANDOM_REQUESTER_ROLE");

    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    // Rinkeby coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;

    // Rinkeby LINK token contract. For other networks, see
    // https://docs.chain.link/docs/vrf-contracts/#configurations
    address link_token_contract = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;

    // A reasonable default is 100000, but this value could be different
    // on other networks.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 1 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 constant numWords = 1;

    // Storage parameters
    uint64 public s_subscriptionId;

    struct RandomRequest {
        uint32 chainId; //  4 Bytes
        uint48 requestTime; //  6 Bytes
        uint48 scheduledTime; //  6 Bytes
        uint48 fullFilledTime; //  6 Bytes
        uint80 spare; // 10 Bytes
        uint256 requestId; // 32 Bytes
        uint256 randomNumber; // 32 Bytes
    }

    mapping(uint256 => RandomRequest) public randomRequests; // chainId + contract address => RandomRequest
    mapping(uint256 => uint256) public requestId_to_contract; // requestid => chainId + contract address

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

    constructor() VRFConsumerBaseV2(vrfCoordinator) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(RANDOM_REQUESTER_ROLE, msg.sender);
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link_token_contract);
        createNewSubscription(); // Create a new subscription when you deploy the contract.
    }

    /**
     * @dev map a chainID and a contract address to a uint256
     * @param _chainId of blockchain where contract is deployed
     * @param _contractAddress contract address
     */
    function chainIdAddressToUint256(uint32 _chainId, address _contractAddress) public pure returns (uint256) {
        return (uint256(_chainId) << 160) | uint256(uint160(_contractAddress));
    }

    /**
     * @dev Request a random number from Chainlink VRF Oracle
     * @dev Assumes the subscription is funded sufficiently.
     * @dev Will revert if subscription is not set and funded.
     * @param _chainId of the blockchain where the corresponding contract is deployed
     * @param _contractAddress which we want the random number assign to
     */
    function requestRandomWords(uint32 _chainId, address _contractAddress) external onlyRandomRequesterRole {
        // TODO - update access rights !!

        uint256 id = chainIdAddressToUint256(_chainId, _contractAddress);
        require(randomRequests[id].requestId == 0, "random number already requested");

        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        randomRequests[id].chainId = _chainId;
        randomRequests[id].requestTime = uint48(block.timestamp);
        randomRequests[id].requestId = requestId;
        requestId_to_contract[requestId] = id;
    }

    /**
     * @dev Chainlink VRF oracle will call this function to deliver the random number
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 id = requestId_to_contract[requestId];
        randomRequests[id].randomNumber = randomWords[0];
        randomRequests[id].fullFilledTime = uint48(block.timestamp);
    }

    function getRandomNumber(uint32 _chainId, address _contractAddress) public view returns (uint256) {
        uint256 id = chainIdAddressToUint256(_chainId, _contractAddress);
        return randomRequests[id].randomNumber;
    }

    function getScheduleRequest(uint32 _chainId, address _contractAddress) public view returns (RandomRequest memory) {
        uint256 id = chainIdAddressToUint256(_chainId, _contractAddress);
        return randomRequests[id];
    }

    // Create a new subscription when the contract is initially deployed.
    function createNewSubscription() private onlyOwner {
        // Create a subscription with a new subscription ID.
        address[] memory consumers = new address[](1);
        consumers[0] = address(this);
        s_subscriptionId = COORDINATOR.createSubscription();
        // Add this contract as a consumer of its own subscription.
        COORDINATOR.addConsumer(s_subscriptionId, consumers[0]);
    }

    // Assumes this contract owns link.
    // 1000000000000000000 = 1 LINK
    function topUpSubscription(uint256 amount) external onlyOwner {
        LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(s_subscriptionId));
    }

    // Add a consumer contract to the subscription.
    function addConsumer(address consumerAddress) external onlyOwner {
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
    }

    // Remove a consumer contract from the subscription.
    function removeConsumer(address consumerAddress) external onlyOwner {
        COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    }

    // Cancel the subscription and send the remaining LINK to a wallet address.
    function cancelSubscription(address receivingWallet) external onlyOwner {
        COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
        s_subscriptionId = 0;
    }

    // Transfer this contract's funds to an address.
    // 1000000000000000000 = 1 LINK
    function withdraw(uint256 amount, address to) external onlyOwner {
        LINKTOKEN.transfer(to, amount);
    }
}
