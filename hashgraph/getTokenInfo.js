import {
    TokenId,
    TokenInfoQuery,
    AccountId,
    PrivateKey,
    Client
} from "@hashgraph/sdk";

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString('0.0.26562420')
const operatorKey = PrivateKey.fromString('302e020100300506032b657004220420a04c5d4726cb5539af95fe2fa304bcba84efd97dd4401e1a760696e38b3e15ba')
const treasuryId = AccountId.fromString('0.0.34008195')
const treasuryKey = PrivateKey.fromString('302e020100300506032b6570042204203d669fb070833586a0ad56dac5c89342c9e4c650e75ba66db367c1a1de458df9')
const aliceId = AccountId.fromString('0.0.34008202')
const aliceKey = PrivateKey.fromString('302e020100300506032b6570042204204d181dea844429adec197d8ed99bd6b79c61b7a72cad1b68b6e78f9a6c129657')

const client = Client.forTestnet().setOperator(operatorId, operatorKey);


async function getTokenInfo(tokenId) {
    if (typeof tokenId === 'string') {
        const tokenObj = TokenId.fromString(tokenId)
        const query = new TokenInfoQuery()
            .setTokenId(tokenObj)

        const queryExecute = await query.execute(client)
        // const tokenName = String(queryExecute.name)
        return queryExecute
    } else {
        throw new Error('Inputted type not string.')
    }
}

export default getTokenInfo