import { Input } from 'antd'
import { Component } from 'react'

class SearchPanel extends Component {
  state = {
    searchValue: '',
  }

  componentDidMount() {
    const { searchValue } = this.props

    this.setState({ searchValue })
  }

  onChangeHandler = ({ target }) => {
    const { value } = target
    const { searchInputHandler } = this.props

    this.setState({ searchValue: value })
    searchInputHandler(value)
  }

  render() {
    const { searchValue } = this.state

    return (
      <Input
        value={searchValue}
        onChange={this.onChangeHandler}
        type="search"
        placeholder="Type to search..."
        style={{ marginBottom: '32px' }}
        autoFocus
      />
    )
  }
}

export default SearchPanel
