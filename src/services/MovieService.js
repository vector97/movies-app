import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'

class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = 'b82f9d026c716e7c9a273521a2b7de4e'

  async createGuestSession() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODJmOWQwMjZjNzE2ZTdjOWEyNzM1MjFhMmI3ZGU0ZSIsInN1YiI6IjYxYjBhYzI4OTk3OWQyMDA2MTg1NjZhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JA21j5_godqHvLHyrTMIsHBZRak37XIQrsQ_WY_CkTk',
      },
    }

    const response = await fetch(`${this._apiBase}/authentication/guest_session/new`, options)

    if (!response.ok) throw new Error(`Could not authenticate, received ${response.status}`)

    return response.json()
  }

  async getResources(search, page = 1) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODJmOWQwMjZjNzE2ZTdjOWEyNzM1MjFhMmI3ZGU0ZSIsInN1YiI6IjYxYjBhYzI4OTk3OWQyMDA2MTg1NjZhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JA21j5_godqHvLHyrTMIsHBZRak37XIQrsQ_WY_CkTk',
      },
    }

    const response = await fetch(
      `${this._apiBase}/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
      options
    )

    if (!response.ok) throw new Error(`Could not fetch ${this._apiBase}, received ${response.status}`)

    return response.json()
  }

  async getAllMovies(search, page) {
    const movies = await this.getResources(search, page)

    return { movies: movies.results.map(this._transformMovie), length: movies.total_results }
  }

  async addRating(movieID, guestSessionID, ratingValue) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value":${ratingValue}}`,
    }

    const response = await fetch(
      `${this._apiBase}/movie/${movieID}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionID}`,
      options
    )
    return response.json()
  }

  async getRatedMovies(guestSessionID, pageNum = 1) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    const response = await fetch(
      `${this._apiBase}/guest_session/${guestSessionID}/rated/movies?api_key=${this._apiKey}&language=en-US&page=${pageNum}&sort_by=created_at.asc`,
      options
    )

    if (!response.ok) throw new Error(`Could not fetch, received ${response.status}`)

    const movies = await response.json()

    return { movies: movies.results.map(this._transformMovie), length: movies.total_results }
  }

  async getMovieGenresList() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODJmOWQwMjZjNzE2ZTdjOWEyNzM1MjFhMmI3ZGU0ZSIsInN1YiI6IjYxYjBhYzI4OTk3OWQyMDA2MTg1NjZhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JA21j5_godqHvLHyrTMIsHBZRak37XIQrsQ_WY_CkTk',
      },
    }

    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    const { genres } = await response.json()

    return genres
  }

  _transformMovie(movie) {
    const { id, title, overview, rating, genre_ids: genresIDs } = movie
    let { poster_path: posterPath, release_date: releaseDate, vote_average: voteAverage } = movie

    if (releaseDate) {
      releaseDate = format(parseISO(releaseDate), 'MMMM d, y')
    }

    if (!posterPath) {
      posterPath = '/v4F270SLg2HM89XzHV4i7o1UXyt.jpg'
    }

    if (voteAverage) {
      voteAverage = Number(voteAverage.toFixed(1))
    }

    return {
      id,
      genresIDs,
      title,
      posterPath,
      releaseDate,
      overview,
      voteAverage,
      rating,
    }
  }
}

export default MovieService
