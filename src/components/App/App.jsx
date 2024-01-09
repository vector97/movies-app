import { MovieServiceProvider } from '../../contexts/MovieServiceContext'
import MovieService from '../../services/MovieService'
import Error from '../Error'
import ListMovies from '../ListMovies'
import SearchPanel from '../SearchPanel'

import { App as Page, Spin, Tabs } from 'antd'
import { debounce } from 'lodash'
import { Component } from 'react'
import { Offline } from 'react-detect-offline'

class App extends Component {
  movieService = new MovieService()

  state = {
    searchValue: '',
    genresList: [],
    movies: [],
    totalMovies: 0,
    currentPage: 1,
    isLoading: false,
    isError: false,
    error: null,
    moviesRated: [],
    totalMoviesRated: 0,
    currentPageRated: 1,
  }

  searchInputHandler = debounce((value) => {
    this.setState({ searchValue: value, currentPage: 1 })
    this.loadMovies(value)
  }, 500)

  componentDidMount() {
    this.authentication()
    this.movieService.getMovieGenresList().then((genresList) => this.setState({ genresList }))
  }

  onMoviesLoaded = ({ movies, totalMovies }) => {
    this.setState({ movies, totalMovies, isLoading: false })
  }

  onRatedMoviesLoaded = ({ movies, totalMovies }) => {
    this.setState({ moviesRated: movies, totalMoviesRated: totalMovies, isLoading: false })
  }

  onError = (e) => {
    this.setState({ isLoading: false, isError: true, error: e })
  }

  onRateChange = async (id, rating) => {
    if (rating > 0) {
      await this.movieService.postRatedMovie(id, rating)
      this.movieService.setLocalRating(id, rating)
    } else {
      await this.movieService.deleteRatedMovie(id)
      localStorage.removeItem(id)
    }
  }

  onTabsChange = (key) => {
    if (key === '1') {
      const { searchValue, currentPage } = this.state

      this.loadMovies(searchValue, currentPage)
    } else if (key === '2') {
      const { currentPageRated } = this.state

      this.loadRatedMovies(currentPageRated)
    }
  }

  pagination = (page) => {
    const { searchValue } = this.state

    this.setState({ currentPage: page })
    this.loadMovies(searchValue, page)
  }

  paginationRated = (page) => {
    this.setState({ currentPageRated: page })
    this.loadRatedMovies(page)
  }

  loadRatedMovies = (page) => {
    this.setState({ isLoading: true, isError: false, error: null })
    this.movieService.getRatedMovies(page).then(this.onRatedMoviesLoaded).catch(this.onError)
  }

  loadMovies(searchValue, page) {
    this.setState({ isLoading: true, isError: false, error: null })
    this.movieService.getAllMovies(searchValue, page).then(this.onMoviesLoaded).catch(this.onError)
  }

  authentication() {
    const guestID = localStorage.getItem('guestID') || this.movieService.createGuestSession()

    return guestID
  }

  render() {
    const {
      movies,
      searchValue,
      currentPage,
      totalMovies,
      isLoading,
      isError,
      error,
      genresList,
      moviesRated,
      totalMoviesRated,
      currentPageRated,
    } = this.state

    const conditions = {
      hasData: !(isLoading || isError),
      hasError: isError,
      inProgress: isLoading,
      empty: !movies.length && !isLoading && !isError && searchValue,
    }

    const searchPage = (
      <>
        <SearchPanel searchValue={searchValue} searchInputHandler={this.searchInputHandler} />
        {conditions.hasData && (
          <ListMovies
            movies={movies}
            totalMovies={totalMovies}
            pagination={this.pagination}
            searchValue={searchValue}
            currentPage={currentPage}
            onRateChange={this.onRateChange}
            getLocalRating={this.movieService.getLocalRating}
          />
        )}
      </>
    )

    const ratedPage = conditions.hasData && (
      <ListMovies
        movies={moviesRated}
        totalMovies={totalMoviesRated}
        pagination={this.paginationRated}
        searchValue={searchValue}
        currentPage={currentPageRated}
        onRateChange={this.onRateChange}
        getLocalRating={this.movieService.getLocalRating}
      />
    )

    const items = [
      {
        key: '1',
        label: 'Search',
        children: searchPage,
      },
      {
        key: '2',
        label: 'Rated',
        children: ratedPage,
      },
    ]

    return (
      <MovieServiceProvider value={genresList}>
        <Page style={{ maxWidth: '1010px', margin: '0 auto' }}>
          <Offline>
            <Error error={{ message: 'Internet Disconnected' }} />
          </Offline>

          <Tabs defaultActiveKey="1" centered destroyInactiveTabPane items={items} onChange={this.onTabsChange} />

          {conditions.inProgress && <Spin />}
          {conditions.hasError && <Error error={error} />}
          {conditions.empty && <Error error={{ message: 'Нет фильмов по вашему запросу' }} />}
        </Page>
      </MovieServiceProvider>
    )
  }
}

export default App
