import * as data from '../data'

export const books = async () => {
  return data.books
}

export const resolvers = {
  Query: {
    books,
  },
  Book: {
    author: async (book) => {
      return data.authors.find((author) => author.id === book.authorId)
    },
  },
}
