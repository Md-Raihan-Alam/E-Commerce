import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Sharedlayout from "./Components/Navbar/SharedLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Register from "./Components/Auth/Register";
import VerifyEmail from "./Components/Verify/VerifyEmail";
import ForgotPassword from "./Components/ResetPassword/Forgot-Password";
import ChangePassword from "./Components/ResetPassword/Change-Password";
import ResetPassword from "./Components/ResetPassword/Reset-Password";
import Product from "./Components/Product/Product";
import UserDashboard from "./Components/User/UserDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sharedlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="Register" element={<Register />} />
          <Route path="Login" element={<Login />} />
          <Route path="user/verify-email" element={<VerifyEmail />} />
          <Route path="user/change-password" element={<ChangePassword />} />
          <Route path="user/forgot-password" element={<ForgotPassword />} />
          <Route path="user/reset-password" element={<ResetPassword />} />
          <Route path="product/:productDetails" element={<Product />} />
          <Route path="user/showme" element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
