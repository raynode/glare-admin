import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import pluralize from 'pluralize'
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'react-admin'

import { queryBuilder } from './query-builder'

const link = new HttpLink({ uri: 'http://localhost:3421' })
const cache = new InMemoryCache()
const client = new ApolloClient({ cache, link })

const introspection = {
  operationNames: {
    [GET_LIST]: resource => `${pluralize(resource.name)}`,
    [GET_ONE]: resource => `${resource.name}`,
    [GET_MANY]: resource => `${pluralize(resource.name)}`,
    [GET_MANY_REFERENCE]: resource => `${pluralize(resource.name)}`,
    [CREATE]: resource => `create${resource.name}`,
    [UPDATE]: resource => `update${resource.name}`,
    [DELETE]: resource => `delete${resource.name}`,
  },
  exclude: undefined,
  include: undefined,
}

class DataProvider extends React.Component {
  constructor() {
    super()
    this.state = { dataProvider: null }
  }

  componentDidMount() {
    queryBuilder({
      client,
      introspection,
    })
    .then(dataProvider => {
      this.setState({ dataProvider })
    })
  }

  render() {
    const { dataProvider } = this.state

    if (!dataProvider) {
      return <div>Loading</div>
    }

    return <App dataProvider={dataProvider} />
  }
}

ReactDOM.render(<DataProvider />, document.getElementById('root'))
// registerServiceWorker()
