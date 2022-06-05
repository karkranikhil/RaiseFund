
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'
import Layout from '../components/layout/Layout'
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
    
    )
}

export default MyApp
