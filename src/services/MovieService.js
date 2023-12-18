import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'

class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/search/movie'

  async getResources() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODJmOWQwMjZjNzE2ZTdjOWEyNzM1MjFhMmI3ZGU0ZSIsInN1YiI6IjYxYjBhYzI4OTk3OWQyMDA2MTg1NjZhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JA21j5_godqHvLHyrTMIsHBZRak37XIQrsQ_WY_CkTk',
      },
    }

    const response = await fetch(`${this._apiBase}?query=return&include_adult=false&language=en-US&page=1`, options)

    if (!response.ok) throw new Error(`Could not fetch ${this._apiBase}, received ${response.status}`)

    return response.json()
  }

  async getAllFilms() {
    const films = await this.getResources()

    return films.results.map(this._transformMovie)
  }

  _transformMovie(movie) {
    const { title, overview } = movie
    let { poster_path: posterPath, release_date: releaseDate } = movie

    if (releaseDate) {
      releaseDate = format(parseISO(releaseDate), 'MMMM d, y')
    }

    if (!posterPath) {
      posterPath = '/v4F270SLg2HM89XzHV4i7o1UXyt.jpg'
    }

    return {
      title,
      posterPath,
      releaseDate,
      overview,
    }
  }
}

export default MovieService
