import App from './components/App'
import Error from './components/Error'

import { Offline, Online } from 'react-detect-offline'
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <div>
    <Online>
      <App />
    </Online>

    <Offline>
      <Error error={{ message: 'Internet Disconnected' }} />
    </Offline>
  </div>
)
