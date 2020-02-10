import { GraphQLClient } from 'graphql-request'

const reInitTestDb = async () => {
  const query = `{
    resetTestDb
  }`

  const client = new GraphQLClient('http://localhost:4000/graphql', {
    headers: {}
  })
  const data = await client.request(query, null)
  console.log('DB resetted:', data)
}

module.exports = { reInitTestDb }
