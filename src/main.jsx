import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Home from './pages/home/home'
import ServerErrorPage from './pages/serverErrorPage/serverErrorPage'
import CoderPage from './pages/coderPage/coderPage';
import PrivateRoute from './components/privateRoute/privateRoute';
import RegisterProblem from './pages/registerProblemPage/registerProblem';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/codingPage" element={<PrivateRoute><CoderPage/></PrivateRoute>}/>
          <Route path="/register" element={<PrivateRoute><RegisterProblem/></PrivateRoute>}/>
          <Route path="/serverError" element={<ServerErrorPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
