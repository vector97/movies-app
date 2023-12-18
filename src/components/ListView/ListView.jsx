import Film from '../Film'

import { List } from 'antd'

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

export default ListView
