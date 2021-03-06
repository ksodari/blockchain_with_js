const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block {
    constructor(timestamp, transactions, previousHash = ''){
        // this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;  
        // just a random number that can be altered
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: "+ this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully Mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i=1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let ksodariCoin = new Blockchain();

// console.log('Mining Block 1....');
// ksodariCoin.addBlock(new Block(1, "20/07/2017", {amount: 4}));

// console.log('Mining Block 2....');
// ksodariCoin.addBlock(new Block(2, "20/07/2017", {amount: 40}));

// console.log("Is Blockchain Valid? " + ksodariCoin.isChainValid());

// ksodariCoin.chain[1].data = {amount: 100};
// ksodariCoin.chain[1].hash = ksodariCoin.chain[1].calculateHash();
// console.log(JSON.stringify(ksodariCoin, null, 4));
// console.log("Is Blockchain Valid? " + ksodariCoin.isChainValid());

//------------------------Bitcoin mining----------------------------//
ksodariCoin.createTransaction(new Transaction('address1', 'address2', 100));
ksodariCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner....');
ksodariCoin.minePendingTransactions('alenas-address');

console.log('\n Balance of Alena is: ', ksodariCoin.getBalanceOfAddress('alenas-address'));

console.log('\n Starting the miner again....');
ksodariCoin.minePendingTransactions('alenas-address');

console.log('\n Balance of Alena is: ', ksodariCoin.getBalanceOfAddress('alenas-address'));