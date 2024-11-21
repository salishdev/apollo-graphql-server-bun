import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeExecutableSchema } from '@graphql-tools/schema'
import lodash from 'lodash'
import * as schemas from './schemas'
import * as resolvers from './resolvers'

const resolversList = Object.values(resolvers).map(({ resolvers }) => resolvers)

const typeDefs = Object.values(schemas).map(({ schema }) => schema)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: lodash.merge({}, ...resolversList),
})

const server = new ApolloServer({ schema })
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(`🚀 Server ready at ${url}`)
