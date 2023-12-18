import MovieService from '../../services/MovieService'
import ListView from '../ListView'

import { App as Page, Spin } from 'antd'
import { Component } from 'react'

class App extends Component {
  movieService = new MovieService()

  state = {
    movies: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.loadMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({ movies, isLoading: false })
  }

  onError = () => {
    this.setState({ isLoading: false, isError: true })
  }

  loadMovies() {
    this.movieService.getAllFilms().then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { movies, isLoading, isError } = this.state

    const hasData = !(isLoading || isError)

    const error = isError ? <>Error</> : null
    const loading = isLoading ? <Spin /> : null
    const content = hasData ? <ListView movies={movies} /> : null

    return (
      <Page style={{ maxWidth: '1010px', margin: '0 auto' }}>
        {error}
        {loading}
        {content}
      </Page>
    )
  }
}

export default App
