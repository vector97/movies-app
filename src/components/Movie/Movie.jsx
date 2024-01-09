import { MovieServiceConsumer } from '../../contexts/MovieServiceContext'

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
  state = {
    rateColor: '#E90000',
    rating: 0,
  }

  componentDidMount() {
    const {
      movie: { voteAverage, id },
      getLocalRating,
    } = this.props

    const rating = getLocalRating(id)
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
      movie: { id },
      onRateChange,
    } = this.props

    this.setState({ rating: value })
    onRateChange(id, value)
  }

  render() {
    const {
      movie: { title, posterPath, releaseDate, overview, voteAverage, genresID },
    } = this.props
    const { rating, rateColor } = this.state

    return (
      <MovieServiceConsumer>
        {(genresList) => {
          const genres = genresList.map(({ id, name }) => genresID.includes(id) && name).filter(Boolean)
          const tags = genres.map((genre) => <Tag key={genre}>{genre}</Tag>)

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
