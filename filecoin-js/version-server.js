const { HttpJsonRpcConnector, LotusClient } = require('filecoin.js')
const ganache = require('ganache')

const server = ganache.server({
  flavor: 'filecoin'
})
server.listen(7777, async (err, blockchain) => {
  const conn = new HttpJsonRpcConnector({ url: 'http://127.0.0.1:7777/rpc/v0' })
  const client = new LotusClient(conn)
  console.log(await client.common.version())
})
