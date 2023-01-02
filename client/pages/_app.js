import '../styles/globals.css'
import { SocketProvider } from '../providers/Socket'

function MyApp({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  )
}

export default MyApp
