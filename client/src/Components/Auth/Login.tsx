import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import uselocalState from "../../utils/localState";
import Loading from "../../utils/Loading";
import url from "../../utils/url";
import axios from "axios";
const Login = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { saveUser } = context;
  const history = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { alert, showAlert, isLoading, setLoading, hideAlert } =
    uselocalState();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    return setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    hideAlert();
    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/v1/auth/login`, userInfo);
      setUserInfo({ email: "", password: "" });
      showAlert({
        type: "success",
        text: `Welcom ${data.user.name}. Redirection to dashboad...`,
      });
      history("/");
    } catch (e: any) {
      showAlert({
        type: "danger",
        text: "There wan an error" || e.response.data.msg,
      });
    }
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center mx-auto h-[90vh]">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>{alert.text}</div>
          )}
          <h1 className="text-xl sm:w-[600px] w-[300px] font-bold leading-tight tracking-tight">
            Sign in to your account
          </h1>
          <div>
            <label className="mb-2 text-sm font-medium">Your email</label>
            <input
              type="email"
              className="bg-gray-50 border border-blue-300sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 dark:focus:border-blue-500"
              placeholder="name@company.com"
              autoComplete="off"
              autoCorrect="off"
              autoFocus={true}
              name="email"
              value={userInfo.email}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label className="mb-2 text-sm font-medium">Your password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="password"
              value={userInfo.password}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button
            className="btn btn-primary mt-3 btn-sm w-full block"
            disabled={isLoading ? true : false}
            onClick={handleSubmit}
          >
            {isLoading ? <Loading /> : <span>Login</span>}
          </button>
          <div className="flex items-center justify-end">
            <span className="text-sm text-primary cursor-pointer mt-2 font-medium text-primary-600 dark:text-primary-500">
              <Link to="/user/forgot-password">Forgot password?</Link>
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-primary  mt-2 font-medium text-primary-600 dark:text-primary-500">
              Don't have a account? <Link to="/Register">Sign up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
