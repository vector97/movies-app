import { Card, Flex, Space, Tag, Typography } from 'antd'

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

export default Film
