
import Header from './Header'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Layout = ({children}) => {
  return (
    <div>
      <ToastContainer/>
      <Header/>
      <div>{children}</div>
    </div>
  )
}

export default Layout
