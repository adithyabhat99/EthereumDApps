pragma solidity >=0.4.22 <0.7.0;

contract Lottery {
    address public manager;
    address[] public players;
    uint public ticketPrice;
    constructor(uint _ticketPrice) public {
        manager = msg.sender;
        ticketPrice = _ticketPrice;
    }
    function enter() public payable {
        require(msg.value >= ticketPrice,"Please send entry price");
        players.push(msg.sender);
    }
    function random() private view returns(uint) {
        uint index = uint(keccak256(abi.encodePacked(block.difficulty,players)));
        return index;
    }
    function pickWinner() public payable restricted {
        uint index = random() % players.length;
        address payable winner = payable(players[index]);
        winner.transfer(getBalance());
        players = new address[](0);
    }
    modifier restricted() {
        require(address(msg.sender) == manager,"you are not authorised");
        _;
    }
    function getCount() public view returns(uint) {
        return players.length;
    }
    function getBalance() public view returns(uint) {
        address myAddress = address(this);
        return uint(myAddress.balance);
    }
}