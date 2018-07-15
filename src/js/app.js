App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    return App.initWeb3();
  },

  initWeb3: function() {
     // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    $.getJSON('AuditorCoin.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AuditorCoinArtifact = data;
      App.contracts.AuditorCoin = TruffleContract(AuditorCoinArtifact);
      // Set the provider for our contract
      App.contracts.AuditorCoin.setProvider(App.web3Provider);
    });

    $.getJSON('DFX.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var DFXArtifact = data;
      App.contracts.DFX = TruffleContract(DFXArtifact);
      // Set the provider for our contract
      App.contracts.DFX.setProvider(App.web3Provider);
      App.fillContractDetails();
    });
    console.log('initContract done');
    return App.bindEvents();
  },
  fillContractDetails() {
    console.log('calling fillContractDetails');
    event.preventDefault();

    var DFXInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.getMetaDataForRelayer();
      }).then(function(result) {
          if(result!='' && typeof result != "undefined") {
          console.log('metadata -> ' + result);
          result = result + ' <br>Collateralized ether: ' + ( parseInt($('#fiatAmountToSend').html()) * parseFloat($('#relayerExchangeRate').html()) ) + '.';
          $('#metaDataForRelayer').html('<u>' + result + '</u>');
        }
      }).catch(function(err) {
        console.log(err.message);
      });

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.getMetaDataForAuditor();
      }).then(function(result) {
        if(result!='' && typeof result != "undefined") {
          console.log('metadata -> ' + result);
          $('#metaDataForAuditor').html('<u>' + result + '</u>');
        }
      }).catch(function(err) {
        console.log(err.message);
      });

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.getAuditorCoinBalance();
      }).then(function(result) {
        if(result!='' && typeof result != "undefined") {
          console.log('metadata -> ' + result);
          $('#auditCoinBalance').html('<u>' + result + '</u>');
        }
      }).catch(function(err) {
        console.log(err.message);
      });

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.getIPFSHash();
      }).then(function(result) {
        if(result!='' && typeof result != "undefined") {
          console.log('metadata -> ' + result);
          $('#ipfsHashProof').html('<u>' + '<a target="_blank" href="http://localhost:8080/ipfs/' + result + '">Link</a></u>');
        }
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },
  bindEvents: function() {
    $(document).on('click', '#initiateContractBtn', App.InitiateContract);
    $(document).on('click', '#sendMoneyBtn', App.SendMoney);
    $(document).on('click', '#rateAuditorBtn', App.RateAuditor);
    $(document).on('click', '#settleContractBtn', App.SettleContract);
  },
  SettleContract: function(event) {
    event.preventDefault();
    var DFXInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log('initiating contract');
      var account = accounts[0];
      console.log('account -> ' + account);

      var settleContractInput = $('#settleContractInput').val();
      console.log('settleContractInput -> ' + settleContractInput);

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.settleContract(parseInt(settleContractInput), {from: account});
      }).then(function(result) {

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  RateAuditor: function(event) {
    event.preventDefault();
    var DFXInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log('initiating contract');
      var account = accounts[0];
      console.log('account -> ' + account);

      var auditorRating = $('#auditorRatingInput').val();
      console.log('auditorRating -> ' + auditorRating);

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.rateAuditor(parseInt(auditorRating), {from: account});
      }).then(function(result) {

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  SendMoney: function(event) {
    event.preventDefault();
    var DFXInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log('initiating contract');
      var account = accounts[0];
      console.log('account -> ' + account);

      var moneySentInput = $('#moneySentInput').val();

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.setIPFSHash(moneySentInput, {from: account});
      }).then(function(result) {

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  InitiateContract: function(event) {
    event.preventDefault();
    var DFXInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log('initiating contract');
      var account = accounts[0];
      console.log('account -> ' + account);


      var auditCoinAddrInput = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";

      console.log('auditCoinAddrInput -> ' + auditCoinAddrInput);

      var auditorAddressInput = $('#auditorAddressInput').val();
      console.log('auditorAddressInput -> ' + auditorAddressInput);

      var fiatRelayerAddressInput = $('#fiatRelayerAddressInput').val();
      console.log('fiatRelayerAddressInput -> ' + fiatRelayerAddressInput);

      var ethAmount = parseInt($('#fiatAmountToSend').html()) * parseFloat($('#relayerExchangeRate').html());
      console.log('ethAmount -> ' + ethAmount);

      var fiatAmount = parseInt($('#fiatAmountToSend').html());
      console.log('fiatAmount -> ' + fiatAmount);

      App.contracts.DFX.deployed().then(function(instance) {
        DFXInstance = instance;
        return DFXInstance.initiateContract(auditCoinAddrInput, auditorAddressInput, fiatRelayerAddressInput, ethAmount, fiatAmount, {from: account, value: web3.toWei(ethAmount, "ether")});
      }).then(function(result) {

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
