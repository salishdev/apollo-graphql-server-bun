import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { schema, transformer } from './disableIf'

describe('disableForEnv directive', () => {
  it('should return null for disabled fields', async () => {
    const typeDefs = `#graphql
    ${schema}
  
    type Query {
      hello: String @disableIf(condition: true)
      goodbye: String
    }
  `

    const resolvers = {
      Query: {
        hello: () => 'Hello, world!',
        goodbye: () => 'Goodbye, world!',
      },
    }

    const originalSchema = makeExecutableSchema({ typeDefs, resolvers })
    const executableSchema = transformer(originalSchema)

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
    const typeDefs = `#graphql
    ${schema}
  
    type Query {
      hello: String @disableIf(condition: false)
      goodbye: String
    }
  `

    const resolvers = {
      Query: {
        hello: () => 'Hello, world!',
        goodbye: () => 'Goodbye, world!',
      },
    }

    const originalSchema = makeExecutableSchema({ typeDefs, resolvers })
    const executableSchema = transformer(originalSchema)

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
    const typeDefs = `#graphql
    ${schema}
  
    type Query {
      hello: String
      goodbye: String
    }
  `

    const resolvers = {
      Query: {
        hello: () => 'Hello, world!',
        goodbye: () => 'Goodbye, world!',
      },
    }

    const originalSchema = makeExecutableSchema({ typeDefs, resolvers })
    const executableSchema = transformer(originalSchema)

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
})
