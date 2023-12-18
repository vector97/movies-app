import MovieService from '../../services/MovieService'

import { Card, Flex, List, App as Page, Space, Spin, Tag, Typography } from 'antd'
import { Component } from 'react'

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

function ListView({ movies }) {
  return (
    <List
      grid={{ gutter: 36, xs: 1, sm: 2 }}
      dataSource={movies}
      renderItem={(movie) => (
        <List.Item>
          <Film movie={movie} />
        </List.Item>
      )}
    />
  )
}

function Film({ movie }) {
  const { title, posterPath, date, overview } = movie

  return (
    <Card
      style={cardStyle}
      bodyStyle={{
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Flex>
        <img alt="poster" src={`https://image.tmdb.org/t/p/original${posterPath}`} style={imgStyle} />

        <Flex
          vertical
          gap={7}
          style={{
            padding: 20,
          }}
        >
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Paragraph level={5} type="secondary" style={{ margin: 0 }}>
            {date}
          </Typography.Paragraph>

          <Space size="8">
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </Space>

          <Typography.Paragraph ellipsis={{ rows: 6, width: 10 }} style={{ margin: 0 }}>
            {overview}
          </Typography.Paragraph>
        </Flex>
      </Flex>
    </Card>
  )
}

export default App
