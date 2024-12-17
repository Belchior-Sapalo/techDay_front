import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Home from './pages/home/home'
import ServerErrorPage from './pages/serverErrorPage/serverErrorPage'
import CoderPage from './pages/coderPage/coderPage';
import PrivateRoute from './components/privateRoute/privateRoute';
import DashBoard from './pages/dashboard/dashBoard'
import AdminAuthPage from './pages/adminAuth/adminAuthPage';
import AdminRoute from './components/privateRoute/adminRoute';
import RegisterProblem from './pages/registerProblemPage/registerProblem';
import ManageProblems from './pages/manageProblems/manageProblems';
import ChallengeResults from './pages/resultsPage/results';
import EditProblem from './pages/editProblem/editProblem';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<AdminAuthPage/>}/>
          <Route path="/dashboard" element={<AdminRoute><DashBoard/></AdminRoute>}>
              <Route path='registerProblem' index element={<AdminRoute><RegisterProblem/></AdminRoute>}/>
              <Route path='manageProblems' index element={<AdminRoute><ManageProblems/></AdminRoute>}/>
          </Route>
          <Route path="/codingPage" element={<PrivateRoute><CoderPage/></PrivateRoute>}/>
          <Route path="/editar" element={<AdminRoute><EditProblem/></AdminRoute>}/>
          <Route path="/resultados" element={<PrivateRoute><ChallengeResults/></PrivateRoute>}/>
          <Route path="/serverError" element={<ServerErrorPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
