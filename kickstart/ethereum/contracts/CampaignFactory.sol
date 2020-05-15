pragma solidity >=0.4.22 <0.7.0;

contract CampaignFactory {
    mapping(string => address ) public deployedCampaigns;
    function createCampaign(string memory _name,uint _minimumContribution) public {
        require(deployedCampaigns[_name] == address(0x0),"name is already taken :(");
        Campaign newCampaign = new Campaign(_name,_minimumContribution,msg.sender);
        deployedCampaigns[_name] = address(newCampaign);
    }
}


contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) votes;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    string public name;
    uint public contributorCount;
    mapping(address => uint) public approvers;
    modifier restricted(){
        require(msg.sender == manager,"Not authorized");
        _;
    }
    modifier approversOnly() {
        require(approvers[msg.sender] >= minimumContribution,"Not authorized");
        _;
    }
    constructor(string memory _name,uint _minimumContribution, address _manager) public {
        manager = _manager;
        minimumContribution = _minimumContribution;
        contributorCount = 0;
        name = _name;
    }
    function contribute() public payable {
        require(msg.value >= minimumContribution,"Minimum contribution required");
        require(approvers[msg.sender] == 0,"Already a contributor");
        approvers[msg.sender] = msg.value;
        contributorCount ++;
    }
    function createRequest(string memory _description, uint _value, address _recipient)
        public restricted {
        Request memory newRequest = Request({
            description:_description,
            value:_value,
            recipient:_recipient,
            complete:false,
            approvalCount:0
        });
        // you can create a struct object using positional arguments too.
        requests.push(newRequest);
    }
    function approveRequest(uint index) public approversOnly {
        Request storage request = requests[index];
        require(!request.votes[msg.sender],"Already voted");
        request.approvalCount++;
        request.votes[msg.sender] = true;
    }
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.complete == false,"Already finalized");
        require(request.approvalCount > (contributorCount/2),"Majority approval required");
        request.complete = true;
        address payable recipient = payable(request.recipient);
        recipient.transfer(request.value);
    }
    function requestsLength() public view returns(uint) {
        return requests.length-1;
    }
}