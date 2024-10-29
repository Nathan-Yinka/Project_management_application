import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/authentication/Signin";
import AuthLayout from "./pages/authentication/AuthLayout";
import Login from "./pages/authentication/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { dashboard, homepage, login, signup } from "./constants/app.routes";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppProvider";


function App() {
  return (
   
    <Router>
       <AppProvider>
      <Routes>
        <Route path={homepage} element={<AuthLayout />}>  
          <Route path={signup} element={<Signin />} />
          <Route path={login} element={<Login />} />
        </Route>
        
        <Route path={dashboard} element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path={"card"} element={< Dashboard/>} />
          </Route>
          
      </Routes>
      <Toaster
      position={"top-right"}
            richColors
            duration={5000}
            className="z-[9999999999999999999]"
            closeButton/>
        </AppProvider>
    </Router>

  );
}

export default App;
