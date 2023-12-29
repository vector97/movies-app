import { Alert } from 'antd'

function Error({ error }) {
  return <Alert message={error.message} description="Repeat the request or contact the service later" type="error" />
}

export default Error
