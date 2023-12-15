import { Card, Flex, List, App as Page, Space, Tag, Typography } from 'antd'

const data = [
  {
    title: 'The way back',
    subtitle: 'March 5, 2020',
    text: 'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high',
  },
  {
    title: 'The way back',
    subtitle: 'March 5, 2020',
    text: 'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high',
  },
  {
    title: 'The way back',
    subtitle: 'March 5, 2020',
    text: 'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high',
  },
  {
    title: 'The way back',
    subtitle: 'March 5, 2020',
    text: 'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high',
  },
]

const cardStyle = {
  width: 450,
  border: 'none',
  borderRadius: 0,
  boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
}
const imgStyle = {
  display: 'block',
  width: 183,
}

function App() {
  return (
    <Page style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <List
        grid={{ gutter: 36, xs: 1, sm: 2 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={cardStyle}
              bodyStyle={{
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <Flex justify="space-between">
                <img
                  alt="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  style={imgStyle}
                />

                <Flex
                  vertical
                  gap={7}
                  style={{
                    padding: 20,
                  }}
                >
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {item.title}
                  </Typography.Title>
                  <Typography.Paragraph level={5} type="secondary" style={{ margin: 0 }}>
                    {item.subtitle}
                  </Typography.Paragraph>

                  <Space size="8">
                    <Tag>Action</Tag>
                    <Tag>Drama</Tag>
                  </Space>

                  <Typography.Paragraph ellipsis={{ rows: 6, width: 10 }} style={{ margin: 0 }}>
                    {item.text}
                  </Typography.Paragraph>
                </Flex>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </Page>
  )
}

export default App
