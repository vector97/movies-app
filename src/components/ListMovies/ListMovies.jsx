import Movie from '../Movie'

import { List } from 'antd'
import { Component } from 'react'

class ListMovies extends Component {
  onChange = (page) => {
    const { pagination } = this.props

    pagination(page)
  }

  render() {
    const { totalMovies, movies, allRatedMovies, currentPage, onRateChange } = this.props

    return (
      <List
        grid={{ gutter: 36, xs: 1, sm: 2 }}
        pagination={{
          current: currentPage,
          align: 'center',
          defaultPageSize: 20,
          total: totalMovies,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: this.onChange,
        }}
        dataSource={movies}
        renderItem={(movie) => (
          <List.Item>
            <Movie movie={movie} allRatedMovies={allRatedMovies} onRateChange={onRateChange} />
          </List.Item>
        )}
      />
    )
  }
}

export default ListMovies
