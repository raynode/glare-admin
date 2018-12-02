import { TypeKind } from 'graphql'
import { DELETE, DELETE_MANY, GET_LIST, GET_MANY, GET_MANY_REFERENCE } from 'react-admin'
import { getFinalType } from './utils'

const sanitizeResource = (introspectionResults, resource) => data => {
  if(!data)
    return {}

  const result = Object.keys(data).reduce((acc, key) => {
    if (key.startsWith('_')) {
      return acc
    }

    const field = resource.type.fields.find(f => f.name === key)
    const type = getFinalType(field.type)

    if (type.kind !== TypeKind.OBJECT) {
      return { ...acc, [field.name]: data[field.name] }
    }

    // FIXME: We might have to handle linked types which are not resources but will have to be careful about
    // endless circular dependencies
    const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name)

    if (linkedResource) {
      const linkedResourceData = data[field.name]

      if (Array.isArray(linkedResourceData)) {
        return {
          ...acc,
          [field.name]: data[field.name].map(sanitizeResource(introspectionResults, linkedResource)),
          [`${field.name}Ids`]: data[field.name].map(d => d.id),
        }
      }

      return {
        ...acc,
        [`${field.name}.id`]: linkedResourceData ? data[field.name].id : undefined,
        [field.name]: linkedResourceData
          ? sanitizeResource(introspectionResults, linkedResource)(data[field.name])
          : undefined,
      }
    }

    return { ...acc, [field.name]: data[field.name] }
  }, {})

  return result
}

export const getResponseParser = introspectionResults => (aorFetchType, resource) => response => {
  const sanitize = sanitizeResource(introspectionResults, resource)
  const data = response.data

  if (aorFetchType === DELETE) return { data: data[0] }
  if (aorFetchType === DELETE_MANY) return { data: [] }

  if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) return {
    data: data.items.nodes.map(sanitize),
    total: data.items.nodes.length, // (data.items.page.page + 1) * data.items.page.limit,
  }

  return { data: sanitize(data.data), total: 1 }
}
