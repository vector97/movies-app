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

      console.log('data', data)

      return data
    } catch (err) {
      return err.message
    }
  }

  async createGuestSession() {
    const data = await this.getResources(`/authentication/guest_session/new?api_key=${this._apiKey}`)

    const { guest_session_id: guestID } = data

    localStorage.setItem('guestID', guestID)

    // todo удалить return
    return guestID
  }

  async getMovieGenresList() {
    const data = await this.getResources(`/genre/movie/list?api_key=${this._apiKey}&language=en-US`)

    const genresList = data.genres.map((genre) => [genre.id, genre.name])

    return genresList
  }

  async getAllMovies(searchValue, page = 1) {
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

    console.log('post rating', id, rating)

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

    console.log('delete rating', id)

    await fetch(
      `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${guestID}`,
      options
    ).catch((err) => err.message)
  }

  getLocalGuestID() {
    console.log('getLocalGuestID: ', localStorage.getItem('guestID'))

    return localStorage.getItem('guestID')
  }

  setLocalRating(id, rating) {
    console.log('setLocalRating: ', id, rating)

    localStorage.setItem(id, rating)
  }

  getLocalRating(id) {
    console.log('getLocalRating: ', id)

    return +localStorage.getItem(id)
  }

  _transformMovie(movie) {
    const { id, title, overview, genre_ids: genresID } = movie
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
    }
  }
}

export default MovieService
