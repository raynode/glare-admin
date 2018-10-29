import { buildVariables } from './build-variables'
import { buildGraphQLQuery } from './build-graphql-query'
import { getResponseParser } from './get-response-parser'

export const buildQuery = introspectionResults => {
  const knownResources = introspectionResults.resources.map(r => r.type.name)

  return (fetchType, resourceName, params) => {
    const resource = introspectionResults.resources.find(r => r.type.name === resourceName)

    if (!resource) {
      throw new Error(
        `Unknown resource ${resourceName}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(
          ', ',
        )}`,
      )
    }

    const queryType = resource[fetchType]

    if (!queryType) {
      throw new Error(
        `No query or mutation matching aor fetch type ${fetchType} could be found for resource ${resource.type.name}`,
      )
    }

    const variables = buildVariables(introspectionResults)(resource, fetchType, params, queryType)
    const query = buildGraphQLQuery(introspectionResults)(resource, fetchType, queryType, variables)
    const parseResponse = getResponseParser(introspectionResults)(fetchType, resource, queryType)

    return {
      query,
      variables,
      parseResponse,
    }
  }
}
