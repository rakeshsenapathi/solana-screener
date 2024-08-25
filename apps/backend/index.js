import { Connection, PublicKey } from '@solana/web3.js'
import { createClient } from 'redis'

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9) // Random unique identifier for your session

const raydium = new PublicKey(process.env.RAYDIUM_PUBLIC_KEY)
const client = createClient()
await client.connect()

client.on('error', (err) => console.log('Redis Client Error', err))

const connection = new Connection(process.env.RPC_ENDPOINT_URL, {
    wsEndpoint: RPC_WEBSOCKET_URL,
    httpHeaders: { 'x-session-hash': SESSION_HASH },
})

// Monitor logs
async function main(connection, programAddress) {
    console.log('Monitoring logs for program:', programAddress.toString())
    connection.onLogs(
        programAddress,
        async ({ logs, err, signature }) => {
            if (err) return

            if (logs && logs.some((log) => log.includes('initialize2'))) {
                console.log("Signature for 'initialize2':", signature)
                const { tokenAAccount } = await fetchRaydiumAccounts(
                    signature,
                    connection
                )
                // After getting tokenAccount of new token i.e meme coin trace that token
                // Get information like price, marketcap and add it to redis cache
                getTokenInfo(tokenAAccount, connection)
            }
        },
        'finalized'
    )
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(txId, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed',
    })

    const accounts = tx?.transaction.message.instructions.find(
        (ix) => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY
    ).accounts

    if (!accounts) {
        console.log('No accounts found in the transaction.')
        return
    }

    const tokenAIndex = 8
    const tokenBIndex = 9

    const tokenAAccount = accounts[tokenAIndex]
    const tokenBAccount = accounts[tokenBIndex]

    // Save to Redis
    if (client && tokenAAccount) {
        await client.hSet(`token-pool-${txId}`, {
            tokenA: tokenAAccount.toBase58(),
            tokenB: tokenBAccount.toBase58(),
            txId: txId,
            timestamp: Date.now(),
        })
    }
    const displayData = [
        { Token: 'A', 'Account Public Key': tokenAAccount.toBase58() },
        { Token: 'B', 'Account Public Key': tokenBAccount.toBase58() },
    ]
    console.log('New LP Found')
    // After a new LP has been found, add the token address to redis database.
    // timely updates to a persistent database like postgres
    // This is sent via socket communication to the frontend in dashboard sorted by time added.
    // After user clicks on a particular token address, we implement the next part
    // price discovery, last 5mins, 10mins and also integrate chart library
    console.log(generateExplorerUrl(txId))
    console.table(displayData)
    return {
        tokenAAccount,
        tokenBAccount,
    }
}

async function getTokenInfo(tokenId, connection) {
    if (tokenId && connection) {
        const clientSubscriptionId = connection.onLogs(
            tokenId,
            ({ logs, err, signature }) => {
                if (err) {
                    console.log('err getTokenInfo', err)
                    return
                }
                console.table([{ logs, signature }])
            }
        )
        await connection.removeAccountChangeListener(clientSubscriptionId)
    }
    return
}

function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`
}

main(connection, raydium).catch(console.error)
