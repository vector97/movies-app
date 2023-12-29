import { Tabs } from 'antd'

function TabsPanel({ pages, loadRatedMovies }) {
  const tabs = ['Search', 'Rated']

  return (
    <Tabs
      defaultActiveKey="1"
      centered
      destroyInactiveTabPane
      items={tabs.map((tab, i) => ({
        label: tab,
        key: tab,
        children: pages[i],
      }))}
      onChange={loadRatedMovies}
    />
  )
}

export default TabsPanel
