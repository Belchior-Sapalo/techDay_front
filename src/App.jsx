import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { AppProvider } from "./components/context/appContext";

function App() {
  
  return (
    <AppProvider>
      <ToastContainer />
      <Outlet />
    </AppProvider>
  );
}

export default App;
