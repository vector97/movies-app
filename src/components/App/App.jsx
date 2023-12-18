import MovieService from '../../services/MovieService'
import Error from '../Error'
import ListView from '../ListView'

import { App as Page, Spin } from 'antd'
import { Component } from 'react'

class App extends Component {
  movieService = new MovieService()

  state = {
    movies: [],
    isLoading: true,
    isError: false,
    error: null,
  }

  componentDidMount() {
    this.loadMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({ movies, isLoading: false })
  }

  onError = (e) => {
    this.setState({ isLoading: false, isError: true, error: e })
  }

  loadMovies() {
    this.movieService.getAllFilms().then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { movies, isLoading, isError, error } = this.state

    const hasData = !(isLoading || isError)

    const errorMessage = isError ? <Error error={error} /> : null
    const loading = isLoading ? <Spin /> : null
    const content = hasData ? <ListView movies={movies} /> : null

    return (
      <Page style={{ maxWidth: '1010px', margin: '0 auto' }}>
        {errorMessage}
        {loading}
        {content}
      </Page>
    )
  }
}

export default App
