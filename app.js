"use strict";

const sha256 = require('js-sha256');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  socket.on('page load', function(msg){
    console.log('A user has connected to ' + msg);
    console.log(blockchain.length);

    //for(var i = 0; i < blockchain.length;i++){
      
      //io.emit('chat message', [blockchain[i].data[0], blockchain[i].data[1], blockchain[i].hash]);
    //}

  });

  socket.on('chat message', function(msg){
    block = createNextBlock(previousBlock, [msg[0], msg[1], msg[2]]);
    blockchain.push(block);
    previousBlock = block;

    console.log(`Block #${block.index} has been added to the blockchain!.`);
    console.log(`Hash: ${block.hash}`);
    console.log(`Room: ${block.data[1]}`);
    console.log(`Data: ${block.data[0]}\n`);

    io.emit('chat message', [msg[0], msg[1], block.hash, msg[2]]);
    
    NumBlock = NumBlock + 1

  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

class Block {
  constructor(index, data, previousHash) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.generateHash();

  }

  generateHash() {
    return sha256.hex(`${this.index}${this.timestamp}${this.data}${this.previousHash}`);
  }
}

function createGenesisBlock() {
  return new Block(0, ['Generis Block', 'Lobby'], '0');
}

function createNextBlock(previousBlock, data) {
  const index = previousBlock.index + 1;
  const previousHash = previousBlock.hash;
  return new Block(index, data, previousHash);
}

var previousBlock;
var blockchain;
var block;
var NumBlock = 0;

function createGen(){
  blockchain = [createGenesisBlock()];
  previousBlock = blockchain[NumBlock];

}

createGen()
