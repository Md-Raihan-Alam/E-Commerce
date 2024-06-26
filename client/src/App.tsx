import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Sharedlayout from "./Components/Navbar/SharedLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Register from "./Components/Auth/Register";
import VerifyEmail from "./Components/Verify/VerifyEmail";
import ForgotPassword from "./Components/PasswordComponent/Forgot-Password";
import ChangePassword from "./Components/PasswordComponent/Change-Password";
import ResetPassword from "./Components/PasswordComponent/Reset-Password";
import Product from "./Components/Product/Product";
import UserDashboard from "./Components/User/UserDashboard";
import Order from "./Order/order";
import ProtectedRoute from "./Components/Navbar/ProtectedRoute";
import { useGlobalContext, GlobalContextTypes } from "./context";
import { useEffect } from "react";
import Loading from "./utils/Loading";
function App() {
  const context = useGlobalContext() as GlobalContextTypes;
  const { fetchUser, isLoading } = context;
  useEffect(() => {
    fetchUser();
  }, []);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sharedlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="Register" element={<Register />} />
          <Route path="Login" element={<Login />} />
          <Route path="user/verify-email" element={<VerifyEmail />} />
          <Route
            path="user/change-password"
            element={<ProtectedRoute element={<ChangePassword />} />}
          />
          <Route path="user/forgot-password" element={<ForgotPassword />} />
          <Route path="user/reset-password" element={<ResetPassword />} />
          <Route
            path="product/:productDetails"
            element={<ProtectedRoute element={<Product />} />}
          />

          <Route
            path="user/showme"
            element={<ProtectedRoute element={<UserDashboard />} />}
          />
          <Route
            path="Order"
            element={<ProtectedRoute element={<Order />} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
