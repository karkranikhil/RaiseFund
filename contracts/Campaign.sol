// SPDX-License-Identifier: Unlicensed

pragma solidity >0.7.0 <=0.9.0;


contract CampaignFactory{ 

    address[] public deployedCampaigns;
    event campaignCreated(
        string title, 
        uint cpRequiredAmount,
        address indexed owner,
        address campaignAddress,
        string cpImgUrl,
        uint indexed timestamp,
        string indexed category,
        string raisingFor,
        string cpDescriptionUrl
    );
    function createCampaign(string memory cpTitle, uint cpRequiredAmount,  string memory cpImgUrl, string memory category, string memory cpDescriptionUrl, string memory raisingFor) public{
        Campaign newCampaign = new Campaign(cpTitle, cpRequiredAmount, cpImgUrl, cpDescriptionUrl, msg.sender);
        deployedCampaigns.push(address(newCampaign));

        emit campaignCreated(cpTitle, cpRequiredAmount, msg.sender, address(newCampaign), cpImgUrl, block.timestamp, category, raisingFor, cpDescriptionUrl);
    }
}
contract Campaign{
    string public title;
    uint public requiredAmount;
    string public image;
    string public description;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp); //indexed use to filter data from UI. Maax 3 can be indexed

    constructor(string memory cpTitle, uint cpRequiredAmount, string memory cpImgUrl, string memory cpDescriptionUrl, address campaignOwner){
        title = cpTitle;
        requiredAmount = cpRequiredAmount;
        image = cpImgUrl;
        description = cpDescriptionUrl;
        owner = payable(campaignOwner);
    }

    function donate() public payable{
        require(requiredAmount > receivedAmount, "required amount fullfilled"); // run function if condition met
        owner.transfer(msg.value);
        receivedAmount +=msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}