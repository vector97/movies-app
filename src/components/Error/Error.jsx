import { Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'

function Error({ error }) {
  return (
    <>
      <Offline>
        <Alert
          message="Internet Disconnected"
          description="Repeat the request or contact the service later"
          type="error"
        />
      </Offline>
      <Online>
        <Alert message={error.message} description="Repeat the request or contact the service later" type="error" />
      </Online>
    </>
  )
}

export default Error
