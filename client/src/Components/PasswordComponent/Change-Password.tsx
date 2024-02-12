import url from "../../utils/url";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import Loading from "../../utils/Loading";
import uselocalState from "../../utils/localState";
import { useGlobalContext, GlobalContextTypes } from "../../context";
const ChangePassword = () => {
  const context = useGlobalContext() as GlobalContextTypes;
  const { alert, showAlert, isLoading, setLoading, hideAlert } =
    uselocalState();
  const { getCookie, logoutUser, saveUser } = context;
  const [password, setPassowords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassowords({ ...password, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    hideAlert();
    const token = getCookie("token");
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${url}/api/v1/users/updateUserPassword`,
        { password, token }
      );
      showAlert({ text: data.msg, type: "success" });
      setTimeout(() => {
        saveUser(null);
        logoutUser();
      }, 2000);
    } catch (error: any) {
      console.log(error);
      showAlert({ text: error.msg, type: "danger" });
    }
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {alert.show && (
            <div className={`alert alert-${alert.type}`}>
              {alert.text || "Error occurred"}
            </div>
          )}
          <h1 className="text-xl sm:w-[600px] w-[300px] font-bold leading-tight tracking-tight">
            Change Password
          </h1>
          <div>
            <label className="mb-2 text-sm font-medium">Old password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="oldPassword"
              value={password.oldPassword}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label className="mb-2 text-sm font-medium">New password</label>
            <input
              type="password"
              className="bg-gray-50 border border-blue-300  sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-blue-500"
              placeholder="******"
              autoComplete="off"
              autoCorrect="off"
              name="newPassword"
              value={password.newPassword}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            className={`btn btn-primary mt-3 btn-sm w-full flex justify-center items-center`}
            disabled={isLoading ? true : false}
            onClick={handleSubmit}
          >
            {isLoading ? <Loading></Loading> : <>Change Password</>}
          </button>
          <button
            onClick={goBack}
            className={`btn btn-secondary mt-3 btn-sm w-full block`}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loading></Loading> : <>Go back</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
