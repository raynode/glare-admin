import { merge } from 'lodash'
import buildDataProvider from 'ra-data-graphql'
import { CREATE, DELETE, DELETE_MANY, UPDATE, UPDATE_MANY } from 'react-admin'

import { buildQuery } from './build-query'
const defaultOptions = { buildQuery }

export const queryBuilder = options =>
  buildDataProvider(merge({}, defaultOptions, options)).then(
    defaultDataProvider => async (fetchType, resource, params) => {
      const handleMultiQuery = type => {
        const { ids, ...otherParams } = params
        return Promise.all(ids.map(id => defaultDataProvider(type, resource, { id, ...otherParams }))).then(results => {
          console.log(results)
          return {
            data: results.reduce((acc, { data }) => [...acc, data.id], []),
          }
        })
      }

      if (fetchType === DELETE_MANY) return handleMultiQuery(DELETE)

      if (fetchType === UPDATE_MANY) return handleMultiQuery(UPDATE)

      if (fetchType === CREATE) {
        if (resource === 'Asset') {
          const form = new FormData()
          form.append('asset', new Blob([params.data.data.rawFile]))
          const res = await fetch('http://localhost:3421/asset', {
            method: 'POST',
            body: form,
          })
          const data = await res.json()
          const mimetype = params.data.data.rawFile.type
          const type = mimetype.split('/')[0]
          return defaultDataProvider(UPDATE, resource, {
            ...params,
            id: data.id,
            data: {
              id: data.id,
              name: params.data.name || params.data.data.rawFile.name,
              type,
              mimetype,
            },
            previousData: data,
          })
        }
      }

      return defaultDataProvider(fetchType, resource, params)
    },
  )
