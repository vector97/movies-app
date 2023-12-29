import MovieService from '../../services/MovieService'
import { MovieServiceConsumer } from '../MovieServiceContext'

import { Card, Flex, Rate, Space, Tag, Typography } from 'antd'
import { Component } from 'react'

import './Movie.css'

const cardStyle = {
  width: 450,
  border: 'none',
  borderRadius: 0,
  boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
}
const imgStyle = {
  flexShrink: 0,
  display: 'block',
  width: 183,
}

class Movie extends Component {
  movieService = new MovieService()

  state = {
    rateColor: '#E90000',
  }

  componentDidMount() {
    const {
      movie: { voteAverage, rating },
    } = this.props

    this.setState({ rating })

    if (voteAverage >= 3 && voteAverage < 5) {
      this.setState({ rateColor: '#E97E00' })
    } else if (voteAverage >= 5 && voteAverage < 7) {
      this.setState({ rateColor: '#E9D100' })
    } else if (voteAverage >= 7) {
      this.setState({ rateColor: '#66E900' })
    }
  }

  onChangeHandler = (value) => {
    const {
      guestSessionID,
      movie: { id },
    } = this.props

    this.setState({ rating: value })
    this.movieService.addRating(id, guestSessionID, value)
  }

  render() {
    const {
      movie: { title, posterPath, releaseDate, overview, voteAverage, genresIDs },
    } = this.props
    const { rating, rateColor } = this.state

    return (
      <MovieServiceConsumer>
        {(genres) => {
          const genresList = genres.map(({ id, name }) => genresIDs.includes(id) && name).filter(Boolean)
          const tags = genresList.map((genre) => <Tag key={genre}>{genre}</Tag>)

          return (
            <Card
              style={cardStyle}
              bodyStyle={{
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <Flex>
                <img
                  src={`https://image.tmdb.org/t/p/original${posterPath}`}
                  style={imgStyle}
                  width={183}
                  height={281}
                  alt="poster"
                />

                <Flex
                  vertical
                  gap={7}
                  style={{
                    padding: 20,
                  }}
                >
                  <Typography.Title level={3} style={{ margin: 0, paddingRight: 25 }}>
                    {title}
                  </Typography.Title>
                  <Typography.Paragraph level={5} type="secondary" style={{ margin: 0 }}>
                    {releaseDate}
                  </Typography.Paragraph>

                  <Space size="small" wrap>
                    {tags}
                  </Space>

                  <Typography.Paragraph ellipsis={{ rows: 3, width: 10 }} style={{ margin: 0 }}>
                    {overview}
                  </Typography.Paragraph>

                  <Space>
                    <Rate count={10} value={rating} onChange={this.onChangeHandler} allowHalf defaultValue={0} />
                    <span className="rate__count" style={{ borderColor: rateColor }}>
                      {voteAverage}
                    </span>
                  </Space>
                </Flex>
              </Flex>
            </Card>
          )
        }}
      </MovieServiceConsumer>
    )
  }
}

export default Movie
