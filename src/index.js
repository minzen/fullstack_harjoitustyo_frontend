import React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from '@apollo/react-hooks'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  // PROD:
  // uri: 'wss://sleepy-woodland-08922.herokuapp.com/graphql',
  // DEV:
  uri: 'wss://pacific-spire-56237.herokuapp.com/graphql',
  // LOCAL:
  // uri: 'ws://localhost:4000/graphql',
  options: { reconnect: true }
})

const httpLink = createHttpLink({
  // PROD:
  //uri: 'https://sleepy-woodland-08922.herokuapp.com/graphql'
  // DEV:
  uri: 'https://pacific-spire-56237.herokuapp.com/graphql'
  // LOCAL:
  // uri: 'http://localhost:4000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('memorytracks-user-token')
  // console.log('Obtained the token from the localStorage: ', token)
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

serviceWorker.unregister()
