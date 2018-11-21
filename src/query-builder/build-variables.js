import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from 'react-admin'

import { getFinalType, isList } from './utils'

const sanitizeValue = (type, value) => {
  if (type.name === 'Int') {
    return parseInt(value, 10)
  }

  if (type.name === 'Float') {
    return parseFloat(value)
  }

  return value
}

const buildGetListVariables = introspectionResults => (resource, aorFetchType, params) => {
  const where = Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids')
      return {
        ...acc,
        id_in: params.filter[key],
      }

    if (typeof params.filter[key] === 'object') {
      const type = introspectionResults.types.find(t => t.name === `${resource.type.name}Filter`)
      const filterSome = type.inputFields.find(t => t.name === `${key}_some`)

      if (filterSome) {
        const filter = Object.keys(params.filter[key]).reduce(
          (acc, k) => ({
            ...acc,
            [`${k}_in`]: params.filter[key][k],
          }),
          {},
        )
        return { ...acc, [`${key}_some`]: filter }
      }
    }

    const parts = key.split('.')

    if (parts.length > 1) {
      if (parts[1] === 'id') {
        const type = introspectionResults.types.find(t => t.name === `${resource.type.name}Filter`)
        const filterSome = type.inputFields.find(t => t.name === `${parts[0]}_some`)

        if (filterSome) {
          return {
            ...acc,
            [`${parts[0]}_some`]: { id: params.filter[key] },
          }
        }

        return { ...acc, [parts[0]]: { id: params.filter[key] } }
      }

      const resourceField = resource.type.fields.find(f => f.name === parts[0])
      const type = getFinalType(resourceField.type)
      return { ...acc, [key]: sanitizeValue(type, params.filter[key]) }
    }

    const resourceField = resource.type.fields.find(f => f.name === key)

    if (resourceField) {
      const type = getFinalType(resourceField.type)
      const isAList = isList(resourceField.type)

      if (isAList) {
        // if the values are a list, any of the values will return a hit
        const values = Array.isArray(params.filter[key])
          ? params.filter[key].map(value => sanitizeValue(type, value))
          : [sanitizeValue(type, [params.filter[key]])]

        return {
          ...acc,
          [`${key}_in`]: values,
        }
      }

      // if(type.name === 'String')

      return {
        ...acc,
        [`${key}_contains`]: sanitizeValue(type, params.filter[key]),
      }
    }

    return { ...acc, [key]: params.filter[key] }
  }, {})

  const perPage = parseInt(params.pagination.perPage, 10)

  const order = params.sort.field && params.sort.order ? `${params.sort.field}_${params.sort.order}` : null

  return {
    page: {
      limit: perPage,
      offset: (parseInt(params.pagination.page, 10) - 1) * perPage,
    },
    order,
    where,
  }
}

const resolveId = data => typeof data === 'object' ? data.id : data

const buildCreateUpdateDataVariables = () => (resource, aorFetchType, params, queryType) =>
  Object.keys(params.data).reduce((acc, key) => {
    // skip id's
    if (key === 'id') return acc

    // skip sub-properties
    if (key.includes('.')) return acc

    const resourceField = resource.type.fields.find(f => f.name === key)

    if(!resourceField)
      return acc

    const type = getFinalType(resourceField.type)
    const isAList = isList(resourceField.type)

    console.log(key, type.kind, params.data[key])

    if(isAList) return {
      ...acc,
      [`${key}`]: {
        id_in: params.data[key].map(resolveId),
      },
    }

    if(type.kind === 'OBJECT') return {
      ...acc,
      [`${key}`]: { id: resolveId(params.data[key]) },
    }

    // SCALAR:
    return {
      ...acc,
      [key]: params.data[key],
    }
  }, {})

export const buildVariables = introspectionResults => (resource, aorFetchType, params, queryType) => {
  console.log(aorFetchType, params, queryType)
  switch (aorFetchType) {
    case GET_LIST: {
      return buildGetListVariables(introspectionResults)(resource, aorFetchType, params, queryType)
    }
    case GET_MANY:
      return {
        where: {
          id_in: params.ids,
        },
      }
    case GET_MANY_REFERENCE: {
      const parts = params.target.split('.')

      return {
        where: { [parts[0]]: { id: params.id } },
      }
    }
    case GET_ONE:
      return {
        where: {
          id: params.id,
        },
      }
    case UPDATE: {
      return {
        data: buildCreateUpdateDataVariables(introspectionResults)(resource, aorFetchType, params, queryType),
        where: {
          id: params.id,
        },
      }
    }

    case CREATE: {
      return {
        data: buildCreateUpdateDataVariables(introspectionResults)(resource, aorFetchType, params, queryType),
        where: {
          id: params.id,
        },
      }
    }

    case DELETE:
      return {
        where: {
          id: params.id,
        },
      }

    default:
      throw new Error('unknown case')
  }
}
