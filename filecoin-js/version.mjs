import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js'

;(async () => {
  const httpConnector = new HttpJsonRpcConnector({
    url: 'http://127.0.0.1:7777/rpc/v0'
  })

  const jsonRpcProvider = new LotusClient(httpConnector)
  const version = await jsonRpcProvider.common.version()
  console.log(version)
})()
  .then()
  .catch()
