import { Input } from 'antd'
import { Component, createRef } from 'react'

class SearchPanel extends Component {
  state = {
    searchValue: '',
  }

  constructor(props) {
    super(props)

    this.searchInput = createRef()
  }

  componentDidMount() {
    this.searchInput.current.focus()
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
        ref={this.searchInput}
        type="search"
        placeholder="Type to search..."
        style={{ marginBottom: '32px' }}
      />
    )
  }
}

export default SearchPanel
