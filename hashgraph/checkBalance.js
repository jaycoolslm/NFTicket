import { Client, AccountBalanceQuery } from '@hashgraph/sdk';

async function checkBalance(accountId) {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = '0.0.26562420';
    const myPrivateKey = '302e020100300506032b657004220420a04c5d4726cb5539af95fe2fa304bcba84efd97dd4401e1a760696e38b3e15ba';

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);

    console.log("The account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");

    return accountBalance.hbars.toTinybars()
}

export default checkBalance