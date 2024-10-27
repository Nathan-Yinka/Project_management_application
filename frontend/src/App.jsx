import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/authentication/Signin";
import AuthLayout from "./pages/authentication/AuthLayout";
import Login from "./pages/authentication/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { dashboard, homepage, login, signup } from "./constants/app.routes";


function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
