pragma solidity ^0.4.19;

contract AuditorCoin {
    mapping(address => uint256) balance;

    function reward(address _addr) {
        balance[_addr]+=1;
    }

    function destroy(address _addr) {
        require(balance[_addr]>0);
        balance[_addr] = balance[_addr] - 1;
    }

    function getBalance(address _addr) constant returns(uint256) {
        return balance[_addr];
    }
}

contract DFX {
    address transmitter;
    address fiatrelayer;
    address auditor;

    uint256 ethAmount;
    uint256 fiatAmount;

    bool auditComplete;
    string metaDataForAuditor;
    string metaDataForRelayer;

    string IPFSHash;

    AuditorCoin auditorCoin;

    function setIPFSHash(string _hash) {
        IPFSHash = _hash;
    }

    function getIPFSHash() constant returns(string) {
        return IPFSHash;
    }

    function getMetaDataForAuditor() constant returns(string) {
        return metaDataForAuditor;
    }

    function getMetaDataForRelayer() constant returns(string) {
        return metaDataForRelayer;
    }

    function getTransmitter() constant returns(address) {
        return transmitter;
    }

    function getFiatRelayer() constant returns(address) {
        return fiatrelayer;
    }

    function getAuditor() constant returns(address) {
        return auditor;
    }

    function getAuditorCoinBalance() constant returns(uint256) {
        return auditorCoin.getBalance(auditor);
    }

    function getEthAmount() constant returns(uint256) {
        return ethAmount;
    }

    function getFiatAmount() constant returns(uint256) {
        return fiatAmount;
    }

    function getCollateralizedBalance() returns(uint256) {
        return this.balance;
    }

    function initiateContract(address auditorCoinAddr, address _auditor, address _fiatrelayer, uint256 _ethAmount, uint256 _fiatAmount) payable {
        require(msg.value > 0);
        auditorCoin = AuditorCoin(auditorCoinAddr);
        ethAmount = _ethAmount;
        fiatAmount = _fiatAmount;

        transmitter = msg.sender;
        auditor = _auditor;
        fiatrelayer = _fiatrelayer;

        auditorCoin.reward(auditor);

        metaDataForAuditor = "The relayer is expected to transmit INR 100 to the recipient. Recipient can be contacted at +91 9999999999 or abc@abc.com";
        metaDataForRelayer = "Smart contract collateralized with requisite ether. Please transfer INR 100 to Bank account: 12345, Bank Name: ABC, Bank Branch: XYZ";
    }

    function settleContract(uint256 _decision) {
        if(_decision == 1) { // fiat was successfully trasnferred, transfer collateral to relayer
            fiatrelayer.transfer(this.balance);
        } else { // fiat was not successfully transferred, fuck off
            transmitter.transfer(this.balance);
        }
    }

    function rateAuditor(uint8 _rating) {
        if(_rating == 1) {
            auditorCoin.reward(auditor);
        }
    }

}
