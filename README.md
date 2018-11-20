# Decentralized blockchain network by using the JavaScript programming language.
Blockchain build with JavaScript on node js 

# Properties
1) A proof of work algorithm to secure the network.
2) Hashing algorithms to secure the data within the blockchain.
3) The ability to mine (create) new blocks that contain data.
4) The ability to create transactions and store them in blocks.
5) An API/server that will be used to interact with the blockchain from the internet.
6) It will be hosted on a decentralized blockchain network.
7) A consensus algorithms to verify that the network nodes have valid data and are synchronized.
8) A broadcasting system to keep the data in the blockchain network synchronized.

# Working

<pre>to run the app, outside the "dev" directory , execute in cmd or shell : <code> npm run node_<1 to 5> </code>
eg <code> npm run node_1</code> , <code> npm run node_2</code> etc.

For node_1, port is 3000
For node_2, port is 3001 
and vice versa till node_5

As no. of nodes here represents the number of devices in a network, 
therefore to run a node, type <code> npm run node_1 </code>
Run these command in separate shell or teminal
</pre>

<b>Prefer Postman for this application</b>

1) to get the blockchain, use <code>GET http://localhost:3001/bloclchain</code>
the first block is the genesis block.

2) to Add a device in the network,  <code>POST http://localhost:3001/register-and-broadcast-node</code>.In the request body type        
    <code>{ "newNetworkNode":"http://localhost:30002" }</code> or the node you want to add. You can add new node from any running node with this format.
    
 3) To mine a block , type <code> GET http://localhost:3001/mine</code>. You can mine from any url in the network and it will be syncronised to every node present in the network.
 
 Now a minig reward is given to the miner and is saved in the pending transaction, and will not show in ledger unless another block is mined
 
 5) for transaction <code> POST http://localhost:3001/transaction/broadcast</code> and in the request body , 
    type <code> { "sender":"","recipient":"","amount":"" } </code>. It will add the transaction to ythe pending transaction of all the nodes in the network and is removed from the transaction unless a new bock in mined.
 
 6) If you add the new node in the network, and done minig and transactions and want to synchronize it with the other nodes in the network  , then use consensus <code> GET http://localhost:3001/consensus</code> make sure you run this from the node you want to add.
