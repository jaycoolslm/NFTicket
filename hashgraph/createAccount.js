import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } from '@hashgraph/sdk';


async function createAccount() {

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

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);
    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " + newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");

    return {
        newAccountId,
        newAccountPrivateKey
    }
}

export default createAccount