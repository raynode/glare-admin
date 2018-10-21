
import { merge } from 'lodash'
import buildDataProvider from 'ra-data-graphql'
import { DELETE, DELETE_MANY, UPDATE, UPDATE_MANY } from 'react-admin'

import { buildQuery } from './build-query'
const defaultOptions = { buildQuery }


export const queryBuilder = options =>
  buildDataProvider(merge({}, defaultOptions, options)).then(
    defaultDataProvider => (fetchType, resource, params) => {
      // const params = {
      //   ...restParams,
      //   ...sort,
      // }
      // const defParams = { pagination, filter, sort, ...restParams }
      // if(pagination)
      //   params.page = {
      //     limit: pagination.perPage,
      //     offset: pagination.page * pagination.perPage,
      //   }
      // if(sort)
      //   params.order = `${sort.field}_${sort.order}`

      const handleMultiQuery = type => {
        const { ids, ...otherParams } = params
        return Promise.all(ids.map(id =>
          defaultDataProvider(type, resource, { id, ...otherParams })
        )).then(results => ({
          data: results.reduce((acc, { data }) => [...acc, data.id], []),
        }))
      }
      // console.log(pagination, filter, sort, params, defParams)

      if (fetchType === DELETE_MANY)
        return handleMultiQuery(DELETE)

      if (fetchType === UPDATE_MANY)
        return handleMultiQuery(UPDATE)

      return defaultDataProvider(fetchType, resource, params)
    }
  )
