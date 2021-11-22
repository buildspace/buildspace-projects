const { Client, CustomFractionalFee, TokenCreateTransaction, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, TokenAssociateTransaction, TransferTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

async function main () {

    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    } else console.log("Environment variables configured Succesfully")
    console.log(myAccountId)

    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    // Build a custom fee schedule 

    const exampleFee = await new CustomFractionalFee()
        .setNumerator(1)
        .setDenominator(10)
        .setFeeCollectorAccountId(myAccountId)

    // Build a token with the fee schedule

    const cookieToken = await new TokenCreateTransaction()
        .setTokenName("Cookie")
        .setTokenSymbol("CRUNCH")
        .setDecimals(4)
        .setInitialSupply(10000)
        .setCustomFees([exampleFee])
        .setTreasuryAccountId(myAccountId)
        .execute(client)

    // Log Token Id
    const cookieTokenReceipt = await cookieToken.getReceipt(client)
    const cookieID = cookieTokenReceipt.tokenId

    console.log("We Have created a cookie token with a custome fee and token ID of ", cookieID.toString())

    // Meet Alice and Bob 

    const alicePrivateKey = await PrivateKey.generate();
    const alicePublicKey = alicePrivateKey.publicKey;

    const aliceCreateAccount = await new AccountCreateTransaction()
        .setKey(alicePublicKey)
        .execute(client);

    const aliceReceipt = await aliceCreateAccount.getReceipt(client);
    const aliceAcountId = aliceReceipt.accountId;

    // create new account Alice
    const bobPrivateKey  = await PrivateKey.generate();
    const bobPublicKey = bobPrivateKey.publicKey;

    const bobCreateAccount = await new AccountCreateTransaction()
        .setKey(bobPublicKey)
        .execute(client);

    const bobReceipt = await bobCreateAccount.getReceipt(client);
    const bobAccountId = bobReceipt.accountId;

    console.log("Bob's account ID is: " + bobAccountId);
    console.log("Alice's account ID is: " + aliceAcountId) 
    
    // Associate Tokens

    const aliceAssociate = await new TokenAssociateTransaction()
        .setTokenIds([cookieID])
        .setAccountId(aliceAcountId)
        .freezeWith(client)
        .sign(alicePrivateKey)

    const aliceAssociatesubmit = await aliceAssociate.execute(client)
    const aliceAssociateReceipt = await aliceAssociatesubmit.getReceipt(client)

    const bobAssociate = await new TokenAssociateTransaction()
        .setTokenIds([cookieID])
        .setAccountId(bobAccountId)
        .freezeWith(client)
        .sign(bobPrivateKey)

    const bobAssociatesubmit = await bobAssociate.execute(client)
    const bobAssociateReceipt = await bobAssociatesubmit.getReceipt(client)

    // Transfer Tokens

    const firstTransfer = await new TransferTransaction()
        .addTokenTransfer(cookieID, myAccountId, -10000)
        .addTokenTransfer(cookieID, aliceAcountId, 10000)
        .execute(client)

    const firstTransferReceipt = await firstTransfer.getReceipt(client)

    const secondTransfer = await new TransferTransaction()
        .addTokenTransfer(cookieID, aliceAcountId, -1000)
        .addTokenTransfer(cookieID, bobAccountId, 1000)
        .freezeWith(client)
        .sign(alicePrivateKey)

    const secondTransferSubmit = await secondTransfer.execute(client)
    const secondTransferReceipt = await secondTransferSubmit.getReceipt(client)

    // Log Balances

    const myBalance = await new AccountBalanceQuery()
        .setAccountId(myAccountId)
        .execute(client)

    const aliceBalance = await new AccountBalanceQuery()
        .setAccountId(aliceAcountId)
        .execute(client)
    
    const bobBalance = await new AccountBalanceQuery()
        .setAccountId(bobAccountId)
        .execute(client)

    console.log("My Account balance is: ", myBalance.tokens.toString()) // expect to be 100 
    console.log("Alice's Account balance is: ", aliceBalance.tokens.toString()) // except to be 9000
    console.log("Bob's Account balance is: ", bobBalance.tokens.toString()) // expect to be 900

}
main();
