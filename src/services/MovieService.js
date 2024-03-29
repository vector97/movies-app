import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'

class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = 'b82f9d026c716e7c9a273521a2b7de4e'

  async getResources(url) {
    try {
      const res = await fetch(`${this._apiBase}${url}`)

      if (!res.ok) throw new Error(`Could not fetch ${this._apiBase}, received ${res.status}`)

      const data = await res.json()

      return data
    } catch (err) {
      return err.message
    }
  }

  async createGuestSession() {
    const data = await this.getResources(`/authentication/guest_session/new?api_key=${this._apiKey}`)

    const { guest_session_id: guestID } = data

    localStorage.setItem('guestID', guestID)
  }

  async getMovieGenresList() {
    const data = await this.getResources(`/genre/movie/list?api_key=${this._apiKey}&language=en-US`)

    const genresList = data.genres.map((genre) => [genre.id, genre.name])

    return genresList
  }

  async getMovies(searchValue, page = 1) {
    const movies = await this.getResources(
      `/search/movie?api_key=${this._apiKey}&language=en-US&query=${searchValue}&page=${page}`
    )

    return {
      currentPage: movies.page,
      movies: movies.results.map(this._transformMovie),
      totalPages: movies.total_pages,
      totalMovies: movies.total_results,
    }
  }

  async getRatedMovies(page = 1) {
    const guestID = this.getLocalGuestID()

    const movies = await this.getResources(
      `/guest_session/${guestID}/rated/movies?api_key=${this._apiKey}&page=${page}`
    )

    return {
      currentPage: movies.page,
      movies: movies.results.map(this._transformMovie),
      totalPages: movies.total_pages,
      totalMovies: movies.total_results,
    }
  }

  async getAllRatedMovies() {
    let counter = 1
    let pages = 1
    const allRatedMovies = []

    do {
      // eslint-disable-next-line no-await-in-loop
      const { movies, totalPages } = await this.getRatedMovies(counter)
      pages = totalPages
      allRatedMovies.push(...movies)

      counter += 1
    } while (counter <= pages)

    return allRatedMovies
  }

  async postRatedMovie(id, rating) {
    const guestID = this.getLocalGuestID()

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    }

    await fetch(
      `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${guestID}`,
      options
    ).catch((err) => err.message)
  }

  async deleteRatedMovie(id) {
    const guestID = this.getLocalGuestID()

    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
    }

    await fetch(
      `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${guestID}`,
      options
    ).catch((err) => err.message)
  }

  getLocalGuestID() {
    return localStorage.getItem('guestID')
  }

  _transformMovie(movie) {
    const { id, title, overview, genre_ids: genresID, rating } = movie
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
      title,
      genresID,
      posterPath,
      releaseDate,
      overview,
      voteAverage: voteAverage || 0,
      rating: rating || 0,
    }
  }
}

export default MovieService
