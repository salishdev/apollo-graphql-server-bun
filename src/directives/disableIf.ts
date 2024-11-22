import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

const directiveName = 'disableIf'

export const schema = `#graphql
  directive @${directiveName}(condition: Boolean!) on FIELD_DEFINITION
`

export function transformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0]
      if (directive) {
        const { resolve = defaultFieldResolver } = fieldConfig
        return {
          ...fieldConfig,
          resolve: async function (source, args, context, info) {
            const { condition } = directive
            if (condition) {
              return null
            }
            return resolve(source, args, context, info)
          },
        }
      }
      return fieldConfig
    },
  })
}
