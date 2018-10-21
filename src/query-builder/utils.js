
import { TypeKind } from 'graphql'

export const isRequired = type => type.kind === TypeKind.LIST
  ? isRequired(type.ofType)
  : type.kind === TypeKind.NON_NULL

export const isList = type => type.kind === TypeKind.NON_NULL
  ? isList(type.ofType)
  : type.kind === TypeKind.LIST

/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type
 */
export const getFinalType = type => type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST
  ? getFinalType(type.ofType)
  : type

