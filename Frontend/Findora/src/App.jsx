import {Routes,Route} from 'react-router-dom'
import './App.css'
import Loader from './components/Loader'
import { ToastContainer,Bounce } from 'react-toastify'
import { lazy, Suspense, useEffect, useState } from 'react'
import ProtectedRoute from './utils/ProtectedRoute'
const SignupPage=lazy(()=>import('./Pages/SignupPage'));
const Error=lazy(()=>import("./Pages/Error"));
const LoginPage=lazy(()=>import("./Pages/LoginPage"));
const HomePage=lazy(()=>import("./Pages/HomePage"));
const AdminDashboard=lazy(()=>import("./Pages/AdminDashboard"));


function App() {
  const[showLoader,setShowLoader]=useState(
    !sessionStorage.getItem("findoraLoaded")
  );
  
  useEffect(()=>{
    if(!showLoader) return;
    const timer=setTimeout(()=>{
      sessionStorage.setItem("findoraLoaded","true");
      setShowLoader(false);
    },2500);

    return ()=>{
      clearTimeout(timer);
    }
  },[showLoader])

  if(showLoader) return <Loader/>;  

  return (
    <>

    <Suspense fallback={<Loader/>}>
    <Routes>
    <Route path='/' element={<LoginPage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path="/homepage" element={
      <ProtectedRoute>
      <HomePage/> 
      </ProtectedRoute>
    }/>
    <Route path='*' element={<Error/>}/>
    </Routes>
    </Suspense>
    
  
  
  {/* Loader */}
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
/>
    </>
  )
}

export default App
