import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, DELETE } from 'react-admin'
import { QUERY_TYPES } from 'ra-data-graphql'
import { TypeKind } from 'graphql'
import * as gqlTypes from 'graphql-ast-types'

import { getFinalType, isList, isRequired } from './utils'

export const buildFields = introspectionResults => fields =>
  fields.reduce((acc, field) => {
    const { name, kind } = getFinalType(field.type)

    if (name.startsWith('_')) return acc

    if (kind !== TypeKind.OBJECT) return [...acc, gqlTypes.field(gqlTypes.name(field.name))]

    const linkedResource = introspectionResults.resources.find(r => r.type.name === name)

    if (linkedResource)
      return [
        ...acc,
        gqlTypes.field(
          gqlTypes.name(field.name),
          null,
          null,
          null,
          gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('id'))]),
        ),
      ]

    const linkedType = introspectionResults.types.find(t => t.name === name)

    if (linkedType)
      return [
        ...acc,
        gqlTypes.field(
          gqlTypes.name(field.name),
          null,
          null,
          null,
          gqlTypes.selectionSet(buildFields(introspectionResults)(linkedType.fields)),
        ),
      ]

    // NOTE: We might have to handle linked types which are not resources but will have to be careful about
    // ending with endless circular dependencies
    return acc
  }, [])

export const getArgType = arg => {
  const type = getFinalType(arg.type)
  const required = isRequired(arg.type)
  const list = isList(arg.type)
  const namedType = gqlTypes.namedType(gqlTypes.name(type.name))

  if (list) return required ? gqlTypes.listType(gqlTypes.nonNullType(namedType)) : gqlTypes.listType(namedType)

  return required ? gqlTypes.nonNullType(namedType) : namedType
}

const getValidVariables = variables => Object.keys(variables).filter(k => typeof variables[k] !== 'undefined')

export const buildArgs = (query, variables) => {
  if (query.args.length === 0) return []

  const validVariables = getValidVariables(variables)

  const args = query.args
    .filter(a => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [...acc, gqlTypes.argument(gqlTypes.name(arg.name), gqlTypes.variable(gqlTypes.name(arg.name)))],
      [],
    )

  return args
}

export const buildApolloArgs = (query, variables) => {
  if (query.args.length === 0) return []

  const validVariables = getValidVariables(variables)

  let args = query.args
    .filter(a => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => [...acc, gqlTypes.variableDefinition(gqlTypes.variable(gqlTypes.name(arg.name)), getArgType(arg))],
      [],
    )

  return args
}

export const buildGraphQLQuery = introspectionResults => (resource, aorFetchType, queryType, variables) => {
  // eslint-disable-next-line no-unused-vars
  const { sortField, sortOrder, ...metaVariables } = variables
  const apolloArgs = buildApolloArgs(queryType, variables)
  const args = buildArgs(queryType, variables)
  const fields = buildFields(introspectionResults)(resource.type.fields)
  if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        'query',
        gqlTypes.selectionSet([
          gqlTypes.field(
            gqlTypes.name(queryType.name),
            gqlTypes.name('items'),
            args,
            null,
            gqlTypes.selectionSet(fields),
          ),
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs,
      ),
    ])
  }

  if (aorFetchType === DELETE) {
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        'mutation',
        gqlTypes.selectionSet([
          gqlTypes.field(
            gqlTypes.name(queryType.name),
            gqlTypes.name('data'),
            args,
            null,
            gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('id'))]),
          ),
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs,
      ),
    ])
  }

  return gqlTypes.document([
    gqlTypes.operationDefinition(
      QUERY_TYPES.includes(aorFetchType) ? 'query' : 'mutation',
      gqlTypes.selectionSet([
        gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('data'), args, null, gqlTypes.selectionSet(fields)),
      ]),
      gqlTypes.name(queryType.name),
      apolloArgs,
    ),
  ])
}
