import LoginPage from './components/loginPage'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UserPage from './components/userPage';
import AdminPage from './components/adminPage';

export default function App(){

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/user" element={<UserPage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </div>

  )
}
