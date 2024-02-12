import { useState, ChangeEvent } from "react";
import axios from "axios";
import uselocalState from "../../utils/localState";
import url from "../../utils/url";
import { Link } from "react-router-dom";
import Loading from "../../utils/Loading";
interface UserInfo {
  name: string;
  email: string;
  password: string;
}
const Register = () => {
  const { alert, showAlert, hideAlert, isLoading, setLoading } =
    uselocalState();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hideAlert();
    const { name, email, password } = userInfo;
    const formData = { name, email, password };

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${url}/api/v1/auth/register`,
        formData
      );
      setUserInfo({ name: "", email: "", password: "" });

      showAlert({
        text: data.msg,
        type: "success",
      });
      hideAlert();
    } catch (error: any) {
      console.log(error);
      const { msg } = error.response?.data || "There was an error";
      console.log(error.response);
      showAlert({ text: msg });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center mx-auto h-[90vh]">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {alert.show ? (
            <div className={`alert alert-${alert.type}`}>
              {alert.text || "There wan an error"}
            </div>
          ) : (
            <></>
          )}

          <h1 className="text-xl sm:w-[600px] w-[240px] font-bold leading-tight tracking-tight">
            Create your account
          </h1>
          <div className="my-2">
            <label className="mb-2 text-sm font-medium">Your Name</label>
            <input
              type="name"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="Firstname Lastname"
              autoComplete="off"
              autoCorrect="off"
              autoFocus={true}
              value={userInfo.name}
              name="name"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="my-2">
            <label className="mb-2 text-sm font-medium">Your email</label>
            <input
              type="email"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 dark:focus:border-blue-500"
              placeholder="name@company.com"
              autoComplete="off"
              autoCorrect="off"
              value={userInfo.email}
              name="email"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="my-2">
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
            className="btn btn-primary w-full block"
            onClick={handleSubmit}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loading /> : <span>Submit</span>}
          </button>
          <div className="flex items-center justify-center">
            <span className="text-sm text-primary mt-2 font-medium text-primary-600 dark:text-primary-500">
              Already have an account? <Link to="/Login">Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
