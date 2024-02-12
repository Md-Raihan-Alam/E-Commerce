import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import url from "../../utils/url";
import uselocalState from "../../utils/localState";
import { useState, ChangeEvent, FormEvent } from "react";
import Loading from "../../utils/Loading";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const ResetPassword = () => {
  const history = useNavigate();
  const query = useQuery();
  const [password, setPassword] = useState("");
  const { alert, showAlert, isLoading, setLoading, hideAlert } =
    uselocalState();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: FormEvent) => {
    hideAlert();
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/v1/auth/reset-password`, {
        password,
        token: query.get("token"),
        email: query.get("email"),
      });
      showAlert({
        text: "Success redirecting to login pase shortly",
        type: "success",
      });
      setTimeout(() => {
        history("/Login");
      }, 3000);
    } catch (error) {
      showAlert({ text: "There were an error" });
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
            Reset Password
          </h1>
          <div>
            <label className="mb-2 text-sm font-medium">New password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading ? true : false}
            className="btn btn-primary mt-3 btn-sm w-full block"
          >
            {isLoading ? <Loading /> : <>Confirm Password</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
