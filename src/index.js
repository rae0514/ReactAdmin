import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

const root = ReactDOM.createRoot(document.getElementById('root'))

const user = storageUtils.getUser()
memoryUtils.user = user

root.render(
    <BrowserRouter>
        <ConfigProvider
            theme={{
            token: {
                colorPrimary: '#13967b'
            }
            }}
        >
            <App/>
        </ConfigProvider>
    </BrowserRouter>
)