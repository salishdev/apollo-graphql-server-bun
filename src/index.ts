import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeExecutableSchema } from '@graphql-tools/schema'
import lodash from 'lodash'

import * as schemaModules from './schemas'
import * as resolverModules from './resolvers'
import * as directiveModules from './directives'

const resolvers = Object.values(resolverModules).map(({ resolvers }) => resolvers)
const typeDefs = [
  ...Object.values(directiveModules).map(({ schema }) => schema),
  ...Object.values(schemaModules).map(({ schema }) => schema),
]

let schema = makeExecutableSchema({
  typeDefs,
  resolvers: lodash.merge({}, ...resolvers),
})

schema = Object.values(directiveModules).reduce(
  (curSchema, { transformer }) => transformer(curSchema),
  schema
)

const server = new ApolloServer({ schema })
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })

console.log(`🚀 Server ready at ${url}`)
