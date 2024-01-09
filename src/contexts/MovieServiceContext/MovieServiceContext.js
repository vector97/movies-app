import { createContext } from 'react'

const { Provider: MovieServiceProvider, Consumer: MovieServiceConsumer } = createContext()

export { MovieServiceConsumer, MovieServiceProvider }
