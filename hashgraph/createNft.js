import {
    AccountId,
    PrivateKey,
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    CustomRoyaltyFee,
    TokenMintTransaction,
    TokenInfoQuery,
    TransferTransaction,
    TokenId,
    TokenAssociateTransaction
} from "@hashgraph/sdk";

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString('0.0.26562420')
const operatorKey = PrivateKey.fromString('302e020100300506032b657004220420a04c5d4726cb5539af95fe2fa304bcba84efd97dd4401e1a760696e38b3e15ba')
const treasuryId = AccountId.fromString('0.0.34008195')
const treasuryKey = PrivateKey.fromString('302e020100300506032b6570042204203d669fb070833586a0ad56dac5c89342c9e4c650e75ba66db367c1a1de458df9')
const aliceId = AccountId.fromString('0.0.34008202')
const aliceKey = PrivateKey.fromString('302e020100300506032b6570042204204d181dea844429adec197d8ed99bd6b79c61b7a72cad1b68b6e78f9a6c129657')

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();

async function createNft(tokenName, tokenSymbol, maxSupply, id, privateKey) {

    const treasuryId1 = AccountId.fromString(id)
    const treasuryKey1 = PrivateKey.fromString(privateKey)

    const royaltyFee = await new CustomRoyaltyFee()
        .setNumerator(1)
        .setDenominator(100)
        .setFeeCollectorAccountId(operatorId)

    //Create the NFT
    let nftCreate = await new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setCustomFees([royaltyFee])
        .setTreasuryAccountId(treasuryId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(maxSupply)
        .setSupplyKey(operatorKey)
        .freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreate.sign(treasuryKey);

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`- Created NFT with Token ID: ${tokenId} \n`);

    return tokenId
}



async function mintNft(tokenId, CID, accountId, accountKey) {
    // Mint NFT
    let mintTx = await new TokenMintTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setMetadata([CID])
        .freezeWith(client)

    let mintTxSign = await mintTx.sign(operatorKey)

    let mintTxSubmit = await mintTxSign.execute(client)

    let mintRx = await mintTxSubmit.getReceipt(client)

    console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`)

    // Associate and transfer NFT

    let associateTx = await new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(PrivateKey.fromString(accountKey));

    let associateTxSubmit = await associateTx.execute(client)
    let associateRx = await associateTxSubmit.getReceipt(client)
    console.log(`NFT association with account: ${associateRx.status}`)


    // Transfer from treasury to user
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(TokenId.fromString(tokenId), 1, treasuryId, AccountId.fromString(accountId))
        .freezeWith(client)
        .sign(treasuryKey)

    let tokenTransferSubmit = await tokenTransferTx.execute(client)
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client)

    console.log(`NFT transfer from treasury to User: ${tokenTransferRx.status}`)

}




const queryTokenSupply = async (tokenId) => {
    const query = new TokenInfoQuery()
        .setTokenId(tokenId)

    const totalSupply = (await query.execute(client)).totalSupply
    //console.log(`Total supply is ${totalSupply}`)
    return totalSupply
}

export { createNft, mintNft, queryTokenSupply }
