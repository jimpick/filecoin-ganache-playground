const {
  HttpJsonRpcConnector,
  LotusClient,
  LotusWalletProvider
} = require('filecoin.js')
const { FilecoinNumber } = require('@glif/filecoin-number')
const ganache = require('ganache')
const delay = require('delay')

const sendAmount = 5

const server = ganache.server({
  flavor: 'filecoin',
  miner: {
    blockTime: 1
  }
})
server.listen(7777, async (err, blockchain) => {
  // Setup client
  const conn = new HttpJsonRpcConnector({ url: 'http://127.0.0.1:7777/rpc/v0' })
  const client = new LotusClient(conn)
  const wallet = new LotusWalletProvider(client)

  // From/to wallet addresses
  const from = await wallet.getDefaultAddress()
  const to = (await wallet.getAddresses())[1]
  console.log('From:', from)
  console.log('To:', to)

  // Before balances
  const fromBalanceBefore = new FilecoinNumber(
    await client.wallet.balance(from),
    'attofil'
  )
  console.log('From balance (before):', fromBalanceBefore.toFil())
  const toBalanceBefore = new FilecoinNumber(
    await client.wallet.balance(to),
    'attofil'
  )
  console.log('To balance (before):', toBalanceBefore.toFil())

  // Send funds
  const amount = new FilecoinNumber(sendAmount, 'fil')
  console.log(`Sending ${amount.toFil()} FIL`)
  // See how Glif does it: https://github.com/glifio/wallet/blob/e3149d6fc34be7748a95b2b67793a5732795f51a/components/Wallet/Send.js/index.jsx#L94

  // FIXME: Fails with "The method Filecoin.GasEstimateMessageGas does not exist/is not available"
  /*
  const message = await wallet.createMessage({
    From: from,
    To: to,
    Value: amount.toAttoFil()
  })
  */

  const message = await wallet.createMessage({
    From: from,
    To: to,
    Value: amount.toAttoFil(),
    GasLimit: '1000000',
    GasFeeCap: '1000000'
    // Avoid calling estimator
    // https://github.com/filecoin-shipyard/filecoin.js/blob/d1dc3db08b51834a0cde07452d034d1b54eb86f3/src/providers/wallet/BaseWalletProvider.ts#L101
  })
  console.log('Raw Message:', message)
  const signedMessage = await wallet.signMessage(message)
  console.log('Signed Message:', signedMessage)
  const msg = await wallet.sendSignedMessage(signedMessage)
  console.log('Msg:', msg)

  // Wait 3 seconds to mine some blocks
  // FIXME: Make it work with instamine mode
  await delay(3000)
  console.log(await client.chain.getHead())

  // After balances
  const fromBalanceAfter = new FilecoinNumber(
    await client.wallet.balance(from),
    'attofil'
  )
  console.log('From balance (after):', fromBalanceAfter.toFil())
  const toBalanceAfter = new FilecoinNumber(
    await client.wallet.balance(to),
    'attofil'
  )
  console.log('To balance (after):', toBalanceAfter.toFil())

  // All done
  process.exit()
})
