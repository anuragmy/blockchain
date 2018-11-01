const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');
const nodeAddress = uuid().split('-').join('');
const bitcoin =  new Blockchain();

var express = require('express');
var app = express();


//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

//Routes
app.get('/blockchain',function(req,res) {
	res.send(bitcoin);
});

app.post('/transaction' , function (req,res) {
	const pendingTransaction = req.body;
	bitcoin.addTransactionToPendingTransaction(pendingTransaction);
	res.json({ note : 'transaction successfully added'});
});

app.post('/transaction/broadcast' , function (req,res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransaction(newTransaction);
	
	const registerBulk = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri : networkNodeUrl + '/transaction',
			method:'POST',
			body : newTransaction,
			json : true
		};
		registerBulk.push(rp(requestOptions));
	});
	Promise.all(registerBulk)
	.then(data => {
		res.json({ note : 'Transaction successfully broadcasted'});
	})
	.catch(error => {
		res.send(error);
	});
});

app.get('/mine' , function (req,res) {
		//getting the last block
	const lastBlock = bitcoin.getLastBLock();


	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transaction : bitcoin.pendingTransactions,
		index : lastBlock['index'] + 1
	};

	const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
	const currentBlockHash = bitcoin.createHashBlock(previousBlockHash,currentBlockData,nonce);

	//creating a new block and adding it to chain
	const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,currentBlockHash);

	const requestPromise = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const registerOptions = {
			uri:networkNodeUrl + '/receive-new-block',
			method:'POST',
			body : {newBlock : newBlock },
			json:true
		};
		requestPromise.push(rp(registerOptions));
	});
	Promise.all(requestPromise)
	.then(data => {
		const registerOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: '00',
				recipient : nodeAddress
			},
			json:true
		};
		return rp(registerOptions);	
	})
	.then(data => {
		res.json({
			note : 'New block successfully mined',
			block : newBlock
		});
	});
});


app.post('/register-and-broadcast-node', function (req,res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
		bitcoin.networkNodes.push(newNodeUrl);
	}

	const registerNodes = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const registerOptions = {
		uri : networkNodeUrl + '/register-node',
		method:'POST',
		body : { newNodeUrl : newNodeUrl },
		json : true
		};
		registerNodes.push(rp(registerOptions));
	});
	Promise.all(registerNodes)
	.then(data => {
			const registerBulk = {
				uri:newNodeUrl + '/register-bulk-nodes',
				method:'POST',
				body :{ allNetworkNodes:[ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ]},
				json: true
			};

			return rp(registerBulk);
	})
	.then(data => {
		res.json({ note : `${newNodeUrl} is registered in the network`});
	});
});

app.post('/register-node', function (req,res) {
	const newNodeUrl = req.body.newNodeUrl;
	const isPresentInNetworkNodes = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const isCurrentNode = bitcoin.currentNodeUrl != newNodeUrl;
	
	if(isCurrentNode && isPresentInNetworkNodes) {
	bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note : `This node has been added successfully with ${bitcoin.currentNodeUrl}`}); 
	}

	else {
	res.json({ note : `This node has already been added with ${bitcoin.currentNodeUrl}`});
	}
});

app.post('/register-bulk-nodes',function (req,res)  {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const isPresentInNetworkNodes = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;  
		const isCurrentNode = bitcoin.currentNodeUrl != networkNodeUrl;                                                                                                                                                               
		if(isPresentInNetworkNodes && isCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note : `All nodes are added in ${bitcoin.currentNodeUrl} `})
});



app.listen(port, function() {
	console.log(`listening on port ${port}`);
});

app.post('/tr',function (req,res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json(newTransaction);
});

app.post('/receive-new-block',function(req,res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBLock();
	const correctHash = lastBlock.hash === newBlock.previousHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctIndex && correctHash ) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransaction = [];
		res.json({
			note:'New block recieved and accepted',
			newBlock:newBlock 
		});
	} 	
	else {
		res.json({
			note:'Block was rejected',
			newBlock:newBlock
		});
	}
});

app.get('/consensus', function(req,res) {
	const requestPromise = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri : networkNodeUrl + '/blockchain',
			method : 'GET',
			json : true
		};
		requestPromise.push(rp(requestOptions));
	});
	Promise.all(requestPromise)
	.then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if(blockchain.chain.length > currentChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransaction;
			}
		});

		if(newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransaction = newPendingTransactions;
		}
		else {
			res.json({
				note: 'Cannot change length',
			});
		}

	});
});

app.get('/block/:blockhash',function (req,res) {
	const blockhash = req.params.blockhash;
	const block = bitcoin.getBlock(blockhash);
	res.json({
		block : block
	});
});

app.get('/transactionId/:transactionId', function(req,res){
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransactionId(transactionId);
	res.json({
		transaction : transactionData.transaction,
		block : transactionData.block
	});
});

app.get('/address/:address',function (req,res) {
	const address = req.params.address;
	const addressData = bitcoin.getAddress(address);
	res.json({
		addressData : addressData	
	});
});

app.get('/block-explorer',function(req, res) {
	res.sendfile('/block-explorer/index.html', { root: __dirname });
});
