import '../styles/globals.css'
import { SocketProvider } from '../providers/Socket'
import { Provider } from 'react-redux'
import { store } from '../redux/index'
import Toast from '../components/Toast'

function MyApp({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Provider store={store}>
        <Toast/>
        <Component {...pageProps} />
      </Provider>
    </SocketProvider>
  )
}

export default MyApp
