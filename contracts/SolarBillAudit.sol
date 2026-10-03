// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SolarBillAudit {
    struct BillRecord {
        string consumerId;
        bytes32 billHash;
        uint256 unitsGenerated;
        uint256 unitsConsumed;
        uint256 timestamp;
        address submittedBy;
    }

    address public owner;
    mapping(uint256 => BillRecord) public bills;
    uint256 public billCount;

    event BillRecorded(uint256 indexed billId, string consumerId, bytes32 billHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function submitBill(
        string memory consumerId,
        bytes32 billHash,
        uint256 unitsGenerated,
        uint256 unitsConsumed
    ) public onlyOwner returns (uint256) {
        billCount++;
        bills[billCount] = BillRecord({
            consumerId: consumerId,
            billHash: billHash,
            unitsGenerated: unitsGenerated,
            unitsConsumed: unitsConsumed,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        });

        emit BillRecorded(billCount, consumerId, billHash);
        return billCount;
    }

    function verifyBill(uint256 billId, bytes32 hashToCheck) public view returns (bool) {
        return bills[billId].billHash == hashToCheck;
    }

    function getBill(uint256 billId) public view returns (BillRecord memory) {
        return bills[billId];
    }
}