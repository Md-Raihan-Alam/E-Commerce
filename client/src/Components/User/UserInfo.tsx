import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext, GlobalContextTypes } from "../../context";
import url from "../../utils/url";
import uselocalState from "../../utils/localState";
import axios from "axios";
import Loading from "../../utils/Loading";
const UserInfo = () => {
  const history = useNavigate();
  const { alert, showAlert, isLoading, setLoading, hideAlert } =
    uselocalState();
  const context = useGlobalContext() as GlobalContextTypes;
  const { user, saveUser, getCookie, logoutUser } = context;
  const [name, setName] = useState(user ? user.name : "");
  const [address, setAddress] = useState(user ? user.address : "");
  const [image, setImage] = useState(user ? user.image : null);
  const handleUpdate = async () => {
    hideAlert();
    setLoading(true);
    const token = getCookie("token");
    try {
      const { data } = await axios.patch(
        `${url}/api/v1/users/updateUser`,
        {
          name,
          address,
          image,
          token,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(data);
      showAlert({ text: data.msg, type: "success" });
      saveUser(data.user);
    } catch (error: any) {
      console.log(error);
      showAlert({ text: error.msg || "Error occures", type: "danger" });
    }
    setTimeout(() => {
      hideAlert();
    }, 2000);
    setLoading(false);
  };
  const handleChangePassword = () => {
    history("/user/change-password");
  };
  const handleLogout = async () => {
    saveUser(null);
    logoutUser();
  };
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };
  if (isLoading === true) {
    return (
      <div className="w-full h-[92vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="form-group my-2">
            {alert.show && (
              <div className={`alert alert-${alert.type}`}>
                {alert.text || "Error occurred"}
              </div>
            )}
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="image">Profile picture</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
            />
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-primary w-full btn-block"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-info w-full btn-block"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
          <div className="w-full my-2">
            <button
              type="button"
              className="btn btn-danger w-full btn-block"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
