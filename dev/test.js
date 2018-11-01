const blockchain = require('./blockchain');

const bitcoin = new blockchain();

// 20181019142302
// http://localhost:3001/blockchain

const bc1 = {
	"chain": [
	  {
		"index": 1,
		"date": 1539938335002,
		"transaction": [
		  
		],
		"nounce": 100,
		"hash": "0",
		"previousHash": "0"
	  },
	  {
		"index": 2,
		"date": 1539938386413,
		"transaction": [
		  
		],
		"nounce": 163336,
		"hash": "0000c1d89c2ff1a6fef1fe02f068d2d6fe8b86747ac6dc16da0b0daddab59aea",
		"previousHash": "0"
	  },
	  {
		"index": 3,
		"date": 1539938427367,
		"transaction": [
		  {
			"amount": 12.5,
			"sender": "00",
			"recipient": "69d7a090d37a11e88eaa43e2bc0645e0",
			"transactionId": "8882bb60d37a11e88eaa43e2bc0645e0"
		  }
		],
		"nounce": 39258,
		"hash": "000042e71dbd5a6125a3e6e06a510af284c1b1da1b7fd6f915e8c6a2b3c2dba8",
		"previousHash": "0000c1d89c2ff1a6fef1fe02f068d2d6fe8b86747ac6dc16da0b0daddab59aea"
	  },
	  {
		"index": 4,
		"date": 1539939171037,
		"transaction": [
		  {
			"amount": 12.5,
			"sender": "00",
			"recipient": "69d7a090d37a11e88eaa43e2bc0645e0",
			"transactionId": "a0e604a0d37a11e88eaa43e2bc0645e0"
		  },
		  {
			"amount": 113,
			"sender": "paaji",
			"recipient": "others",
			"transactionId": "40a91b70d37c11e88eaa43e2bc0645e0"
		  },
		  {
			"amount": 123,
			"sender": "paaji",
			"recipient": "others",
			"transactionId": "46181930d37c11e88eaa43e2bc0645e0"
		  }
		],
		"nounce": 88524,
		"hash": "0000a44c69691b081b8746aed20fdb9207db6543d0cf59774aaeb56ca119205d",
		"previousHash": "000042e71dbd5a6125a3e6e06a510af284c1b1da1b7fd6f915e8c6a2b3c2dba8"
	  }
	],
	"pendingTransaction": [
	  {
		"amount": 12.5,
		"sender": "00",
		"recipient": "69d7a090d37a11e88eaa43e2bc0645e0",
		"transactionId": "5c290e00d37c11e88eaa43e2bc0645e0"
	  }
	],
	"currentNodeUrl": "http://localhost:3001",
	"networkNodes": [
	  
	]
  };



//console.log(bitcoin.chainIsValid(bc1.chain)); 
//console.log(bitcoin.chainIsValid(bc1.chain));
const timestamp = new Date(1540034510690);
console.log(timestamp);