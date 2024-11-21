export const schema = `#graphql
  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`
