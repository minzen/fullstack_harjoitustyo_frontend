import { GraphQLClient } from 'graphql-request'

const serverUrl = 'https://pacific-spire-56237.herokuapp.com/graphql'

const reInitTestDb = async () => {
  const query = `{
    resetTestDb
  }`

  const client = new GraphQLClient(serverUrl, {
    headers: {}
  })
  const data = await client.request(query, null)
  console.log('DB resetted:', data)
}

module.exports = { reInitTestDb }
