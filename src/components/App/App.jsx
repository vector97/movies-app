import MovieService from '../../services/MovieService'
import Error from '../Error'
import ListMovies from '../ListMovies'
import { MovieServiceProvider } from '../MovieServiceContext'
import SearchPanel from '../SearchPanel'
import TabsPanel from '../TabsPanel'

import { App as Page, Spin } from 'antd'
import { debounce } from 'lodash'
import { Component } from 'react'

class App extends Component {
  movieService = new MovieService()

  state = {
    movies: [],
    length: null,
    isLoading: false,
    isError: false,
    error: null,
    searchValue: '',
    currentPage: 1,
  }

  searchInputHandler = debounce((value) => {
    this.setState({ searchValue: value, currentPage: 1 })
    this.loadMovies(value)
  }, 500)

  componentDidMount() {
    this.authentication()
    this.movieService.getMovieGenresList().then((genres) => this.setState({ genres }))
  }

  onMoviesLoaded = ({ movies, length }) => {
    this.setState({ movies, length, isLoading: false })
  }

  onError = (e) => {
    this.setState({ isLoading: false, isError: true, error: e })
  }

  pagination = (searchValue, page) => {
    this.setState({ currentPage: page })
    this.loadMovies(searchValue, page)
  }

  loadRatedMovies = (tab) => {
    if (tab === 'Rated') {
      const { guestSessionID } = this.state

      this.setState({ isLoading: true })
      this.movieService.getRatedMovies(guestSessionID).then(this.onMoviesLoaded).catch(this.onError)
    } else if (tab === 'Search') {
      const { searchValue } = this.state

      this.loadMovies(searchValue)
    }
  }

  authentication() {
    this.movieService.createGuestSession().then((data) => {
      this.setState({ guestSessionID: data.guest_session_id })
    })
  }

  loadMovies(search = 'return', page = 1) {
    this.setState({ isLoading: true })
    this.movieService.getAllMovies(search, page).then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { movies, searchValue, currentPage, length, isLoading, isError, error, guestSessionID, genres } = this.state
    const conditions = {
      hasData: !(isLoading || isError),
      hasError: isError,
      inProgress: isLoading,
      empty: !movies.length && !isLoading && !isError && searchValue,
    }

    const searchPage = (
      <>
        <SearchPanel searchInputHandler={this.searchInputHandler} />
        {conditions.hasData && (
          <ListMovies
            movies={movies}
            length={length}
            pagination={this.pagination}
            searchValue={searchValue}
            currentPage={currentPage}
            guestSessionID={guestSessionID}
          />
        )}
      </>
    )

    const ratedPage = conditions.hasData && (
      <ListMovies
        movies={movies}
        length={length}
        pagination={this.pagination}
        searchValue={searchValue}
        currentPage={currentPage}
        guestSessionID={guestSessionID}
      />
    )

    const pages = [searchPage, ratedPage]

    return (
      <MovieServiceProvider value={genres}>
        <Page style={{ maxWidth: '1010px', margin: '0 auto' }}>
          <TabsPanel pages={pages} loadRatedMovies={this.loadRatedMovies} />
          {conditions.inProgress && <Spin />}
          {conditions.hasError && <Error error={error} />}
          {conditions.empty && <Error error={{ message: 'Нет фильмов по вашему запросу' }} />}
        </Page>
      </MovieServiceProvider>
    )
  }
}

export default App
