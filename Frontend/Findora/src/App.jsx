import {Routes,Route} from 'react-router-dom'
import './App.css'
import Loader from './components/Loader'
import { lazy, Suspense } from 'react'
const SignupPage=lazy(()=>import('./Pages/SignupPage'));
const Error=lazy(()=>import("./Pages/Error"));
const LoginPage=lazy(()=>import("./Pages/LoginPage"));
const HomePage=lazy(()=>import("./Pages/HomePage"));
const AdminDashboard=lazy(()=>import("./Pages/AdminDashboard"));


function App() {
  
  return (
    <>
    <Suspense fallback={<Loader/>}>
    <Routes>
    <Route path='/' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path='*' element={<Error/>}/>
    </Routes>
    </Suspense>
    </>
  )
}

export default App
