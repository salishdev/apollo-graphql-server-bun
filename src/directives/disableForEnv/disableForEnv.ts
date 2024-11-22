import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

const directiveName = 'disableForEnv'

export const schema = `#graphql
  directive @${directiveName}(envs: [String!]) on FIELD_DEFINITION
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
            const { envs } = directive
            if (envs.includes(process.env.NODE_ENV)) {
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
