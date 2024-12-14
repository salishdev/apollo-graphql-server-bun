import * as data from '../data'

const authors = async () => {
  return data.authors
}

export const resolvers = {
  Query: {
    authors,
  },
  Author: {
    books: async (author) => data.books.filter((book) => book.authorId === author.id),
    fullName: async (author) => `${author.firstName} ${author.lastName}`,
  },
}
