import Movie from '../Movie'

import { List } from 'antd'
import { Component } from 'react'

class ListMovies extends Component {
  onChange = (page) => {
    const { pagination, searchValue } = this.props

    pagination(searchValue, page)
  }

  render() {
    const { length, movies, currentPage, guestSessionID } = this.props

    return (
      <List
        grid={{ gutter: 36, xs: 1, sm: 2 }}
        pagination={{
          current: currentPage,
          align: 'center',
          defaultPageSize: 20,
          total: length,
          showSizeChanger: false,
          onChange: this.onChange,
        }}
        dataSource={movies}
        renderItem={(movie) => (
          <List.Item>
            <Movie movie={movie} guestSessionID={guestSessionID} />
          </List.Item>
        )}
      />
    )
  }
}

export default ListMovies
