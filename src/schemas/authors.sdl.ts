export const schema = `#graphql
  type Author {
    firstName: String
    lastName: String
    fullName: String
    books: [Book]
  }

  type Query {
    # authors: [Author] @disableIf(condition: process.env.DISABLE === 'TRUE')
    authors: [Author] @disableForEnv(envs: ["preview", "qa"])
  }
`
