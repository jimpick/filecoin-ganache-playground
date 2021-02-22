import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js'

const conn = new HttpJsonRpcConnector({ url: 'http://127.0.0.1:7777/rpc/v0' })
const client = new LotusClient(conn)
console.log(await client.common.version())
