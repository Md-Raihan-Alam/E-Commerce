import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import uselocalState from "../../utils/localState";
import url from "../../utils/url";
import Loading from "../../utils/Loading";
const ForgotPassword = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const { alert, showAlert, isLoading, setLoading, hideAlert } =
    uselocalState();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    hideAlert();
    try {
      const { data } = await axios.post(`${url}/api/v1/auth/forgot-password`, {
        email,
      });
      showAlert({ text: data.msg, type: "success" });
      setEmail("");
    } catch (e) {
      showAlert({ text: "Something went wrong, try again", type: "danger" });
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>{alert.text}</div>
          )}
          <h1 className="text-xl sm:w-[600px] w-[300px] font-bold leading-tight tracking-tight">
            Forgot Password
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
              value={email}
              onChange={handleChange}
            />
          </div>
          <Link
            to="/Login"
            className="btn btn-primary mt-3 btn-sm w-full block"
          >
            Go Back
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading ? true : false}
            className="btn btn-primary mt-3 btn-sm w-full block"
          >
            {isLoading ? <Loading /> : <>Reset Password</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
