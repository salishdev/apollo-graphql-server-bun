import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { schema, transformer } from './disableForEnv'

const typeDefs = `#graphql
  ${schema}

  type Query {
    hello: String @disableForEnv(envs: ["production", "staging"])
    goodbye: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    goodbye: () => 'Goodbye, world!',
  },
}

describe('disableForEnv directive', () => {
  let executableSchema: any

  beforeEach(() => {
    const originalSchema = makeExecutableSchema({ typeDefs, resolvers })
    executableSchema = transformer(originalSchema)
  })

  it('should return null for disabled fields in specified environments', async () => {
    process.env.NODE_ENV = 'production'
    const query = `#graphql
      query {
        hello
        goodbye
      }
    `
    const result = await graphql({ schema: executableSchema, source: query })
    expect(result.data).toEqual({
      hello: null,
      goodbye: 'Goodbye, world!',
    })
  })

  it('should return the field value for enabled fields', async () => {
    process.env.NODE_ENV = 'development'
    const query = `#graphql
      query {
        hello
        goodbye
      }
    `
    const result = await graphql({ schema: executableSchema, source: query })
    expect(result.data).toEqual({
      hello: 'Hello, world!',
      goodbye: 'Goodbye, world!',
    })
  })

  it('should not affect fields without the directive', async () => {
    process.env.NODE_ENV = 'production'
    const query = `#graphql
      query {
        goodbye
      }
    `
    const result = await graphql({ schema: executableSchema, source: query })
    expect(result.data).toEqual({
      goodbye: 'Goodbye, world!',
    })
  })
})
