const { Client, ContractCreateTransaction, FileCreateTransaction, FileId, Hbar, PrivateKey, ContractCallQuery, ContractFunctionParameters, ContractExecuteTransaction } = require("@hashgraph/sdk");
require("dotenv").config();
const json = require('./compiled.json');
const BigNumber = require('bignumber.js');

async function main () {

    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forPreviewnet();

    client.setOperator(myAccountId, myPrivateKey)

    const compiled = json['data']['bytecode']['object'];
    // Store Compiled Contact in file service. Different from eth.
    const mycontract = await new FileCreateTransaction()
        .setContents(compiled)
        .setKeys([PrivateKey.fromString(myPrivateKey)])
        // The default max fee of 1 HBAR is not enough to make a file ( starts around 1.1 HBAR )
        .setMaxTransactionFee(new Hbar(2)) // 2 HBAR
        .execute(client);
    // get file ID
    const TransactionReceipt  = await mycontract.getReceipt(client);
    const fileid =  new FileId(TransactionReceipt.fileId);
    console.log("file ID: " + fileid);
  
    // Deploy Contract
    const deploy = await new ContractCreateTransaction()
        .setGas(300)
        .setBytecodeFileId(fileid)
        .execute(client);

    const receipt = await deploy.getReceipt(client); //Get the new contract 
    const newContractId = receipt.contractId;        
    console.log("The contract ID is " + newContractId);
  
  
    // Call contract set function to change state variable

    const setter = await new ContractExecuteTransaction()
        .setContractId(newContractId)
        .setGas(400000)
        .setFunction("set", new ContractFunctionParameters().addUint256(7))
        .setMaxTransactionFee(new Hbar(3))

    // log to see if success
    const contractCallResult = await setter.execute(client);
    const testing = await contractCallResult.getReceipt(client);
    console.log("Status Code:", testing.status)

    // call contract get function to read state variable
    const getter = await new ContractCallQuery() // 
        .setContractId(newContractId)
        .setFunction("get")
        .setGas(300000)
        .setMaxQueryPayment(new Hbar(1)) // defaults to 1, if requires more than one need change

    // log to see success
    const contractGetter = await getter.execute(client);
    const message = await contractGetter.getUint256(0);
    console.log("contract message: " + message);
}
main();
