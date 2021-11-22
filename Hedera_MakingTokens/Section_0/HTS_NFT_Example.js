const { Client, TokenCreateTransaction, PrivateKey, TokenType, TokenSupplyType, TokenMintTransaction, TokenNftInfoQuery, NftId } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    const myAcountId = process.env.MY_ACCOUNT_ID;

    const client = Client.forTestnet();

    if (myAcountId == null || myPrivateKey == null){
        throw new Error("Environment Variables Not Configured");
    }

    client.setOperator(myAcountId, myPrivateKey);

    const myToken = await new TokenCreateTransaction()
        .setTokenName("Teddy W")
        .setTokenSymbol("TW")
        .setDecimals(0)
        .setInitialSupply(0)
        .setSupplyKey(PrivateKey.fromString(myPrivateKey))
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(3)
        .setTreasuryAccountId(myAcountId)
        .execute(client);

    const myTokenReciept = await myToken.getReceipt(client);
    const myTokenId = myTokenReciept.tokenId;

    console.log("My token ID is: " + myTokenId);
    
    const diploma = await new TokenMintTransaction()
        .setTokenId(myTokenId)
        .setMetadata([Buffer.from("Qmd3ZfNJ4EojWTkwJ9FVJTDymfBkR1u9WVUbjYAwdRjRz5")])
        .execute(client)

    const myDiplomaReciept = await diploma.getReceipt(client)
    const diplomaSerial = myDiplomaReciept.serials[0].toNumber()

    console.log(myTokenReciept.totalSupply)

    console.log("My diploma's serial number is: ", diplomaSerial)

    const diplomaInfo = await new TokenNftInfoQuery()
        .setNftId(new NftId(myTokenId, diplomaSerial))
        .execute(client)

    console.log("My diploma NFTs metadata is: ", diplomaInfo[0].metadata.toString())
}
main();
